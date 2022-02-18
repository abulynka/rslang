import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import {
  ChartData,
  UserStatistics,
  UserWord,
  UserWordOptional,
  Word,
  WordHistoryUnit,
} from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { WordsService } from './words.service';

class NewAmount {
  public sprint: number = 0;
  public gameCall: number = 0;
  public common = (average: number = 1): number =>
    (this.sprint + this.gameCall) / average;
}

const getCurrentDate = (): number => {
  const date: Date = new Date();
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
};

const getWordFirstDate = (history?: WordHistoryUnit): number => {
  return Number(Object.keys(history || {})[0] || 0);
};

const checkDates = (history?: WordHistoryUnit): boolean => {
  const currentDate: number = getCurrentDate();
  let isLearnedToday: boolean = false;
  Object.keys(history || {}).forEach((data: string) => {
    if (Number(data) > currentDate) isLearnedToday = true;
  });
  return isLearnedToday;
};

const getWinRate = (
  history?: WordHistoryUnit,
  isPerADay: boolean = false
): number | undefined => {
  if (!history) return;
  const currentDate: number = getCurrentDate();
  const keys: string[] = Object.keys(history || {});
  return (
    keys.filter((key: string) => {
      const answer: boolean = history[key].isRight;
      if (isPerADay && Number(key) > currentDate && answer) {
        return answer;
      }
      if (!isPerADay && answer) {
        return answer;
      }
      return false;
    }).length / (keys.length || 1)
  );
};

const getDayOfTheFirstMeeating = (
  ...args: Array<WordHistoryUnit | undefined>
): number | undefined => {
  const dates: number[] = [];
  args.forEach((data: WordHistoryUnit | undefined) => {
    const firstDate: number = getWordFirstDate(data);
    if (firstDate !== 0) dates.push(firstDate);
  });
  return dates.sort().reverse()[0];
};

const formattingDate = (dateMS: number): string => {
  const date: Date = new Date(dateMS);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};
@Injectable({
  providedIn: 'root',
})
export class UserStatisticsService {
  public userWords: Word[] = [];
  public newWordsAmount: NewAmount = new NewAmount();
  public gameWinsRate: NewAmount = new NewAmount();
  public sprintSeries: number = 0;
  public audioSeries: number = 0;
  public sprintWinRate: number = 0;
  public audioWinRate: number = 0;
  public commonWinRate: number = 0;

  private sprintWinRateArr: number[] = [];
  private audioWinRateArr: number[] = [];
  private commonWinRateArr: number[] = [];
  public constructor(
    private wordsService: WordsService,
    private http: HttpService,
    private auth: AuthService
  ) {}

  public getUserWords(cb: () => void): void {
    this.wordsService
      .getAggregatedWords(
        undefined,
        undefined,
        JSON.stringify({
          $or: [
            { 'userWord.difficulty': 'easy' },
            { 'userWord.difficulty': 'hard' },
          ],
        })
      )
      .subscribe((data: Word[]) => {
        this.clearData();
        this.userWords = data;
        this.setStatisticsData();
        cb();
      });
  }

  public getUserStatistics(): Observable<UserStatistics> {
    const path: string = `/users/${this.auth.getCurrentUserId()}/statistics`;
    return this.http.get(path).pipe(
      catchError((err: HttpErrorResponse) => {
        const statusCode: number = 404;
        if (err.status === statusCode) {
          const body: UserStatistics = {
            learnedWords: 0,
            optional: {
              sprintSeriesOfAnswers: 0,
              audioSeriesOfAnswers: 0,
            },
          };
          this.updatUserStatistics(body);
          return [body];
        }
        return [];
      })
    );
  }

  public updatUserStatistics(body: UserStatistics): void {
    this.wordsService.getAllLearnedWords().subscribe((data: Word[]) => {
      body.learnedWords = data.length;
      delete body.id;
      this.http
        .put(`/users/${this.auth.getCurrentUserId()}/statistics`, body)
        .subscribe();
    });
  }

  public getLearnedWordsPerADay(): Observable<Word[]> {
    return this.wordsService.getAllLearnedWords().pipe<Word[]>(
      map((words: Word[]) => {
        return words.filter((word: Word): boolean => {
          if (!word.userWord) return false;
          const optional: UserWordOptional = word.userWord.optional;
          if (
            checkDates(optional.sprintHistory) ||
            checkDates(optional.gameCallhistory)
          ) {
            return true;
          }
          return false;
        });
      })
    );
  }

  public getAmountOfNewWordsForEachDay(): ChartData[] {
    const chartData: ChartData[] = [];
    const wordDates: Map<string, number> = new Map();

    this.userWords.forEach((data: Word) => {
      const userWord: UserWord = <UserWord>data.userWord;
      const wordFirstMeating: number | undefined = getDayOfTheFirstMeeating(
        userWord.optional.sprintHistory,
        userWord.optional.gameCallhistory
      );
      if (wordFirstMeating) {
        const formattedData: string = formattingDate(wordFirstMeating);
        const mapValue: number | undefined = wordDates.get(formattedData);
        wordDates.set(formattedData, mapValue ? mapValue + 1 : 1);
      }
    });
    wordDates.forEach((value: number, name: string) => {
      chartData.push({
        name,
        value,
      });
    });
    return chartData.sort((a: ChartData, b: ChartData) =>
      a.name.localeCompare(b.name)
    );
  }

  public getNumberByIncreaseWords(): ChartData[] {
    return this.getAmountOfNewWordsForEachDay().map(
      (data: ChartData, i: number, arr: ChartData[]) => {
        if (i === 0) return data;
        data.value += arr[i - 1].value;
        return data;
      }
    );
  }

  private setStatisticsData(): void {
    const currentDate: number = getCurrentDate();

    this.userWords.forEach((word: Word) => {
      const userWord: UserWord | undefined = word.userWord;
      if (userWord) {
        this.setAmountOfNewWords(userWord, currentDate);
        this.fillWinRatesArrays(userWord);
      }
    });
  }

  private fillWinRatesArrays(userWord: UserWord): void {
    const optional: UserWordOptional = userWord.optional;
    const sprintRate: number | undefined = getWinRate(optional.sprintHistory);
    const audioRate: number | undefined = getWinRate(optional.gameCallhistory);
    const sprintRatePerDay: number | undefined = getWinRate(
      optional.sprintHistory,
      true
    );
    const audioRatePerDay: number | undefined = getWinRate(
      optional.gameCallhistory,
      true
    );
    if (sprintRate !== undefined) this.sprintWinRateArr.push(sprintRate);
    if (audioRate !== undefined) this.audioWinRateArr.push(audioRate);
    if (sprintRatePerDay !== undefined)
      this.commonWinRateArr.push(sprintRatePerDay);
    if (audioRatePerDay !== undefined)
      this.commonWinRateArr.push(audioRatePerDay);
    this.updateWinRate();
  }

  private updateWinRate(): void {
    const factor: number = 100;
    const getAverage = (arr: number[]): number => {
      if (arr.length === 0) return 0;
      const rate: number =
        Number(
          (
            arr.reduce((a: number, b: number): number => a + b) / arr.length
          ).toFixed(2)
        ) * factor;
      return Number.isNaN(rate) ? 0 : rate;
    };
    this.sprintWinRate = getAverage(this.sprintWinRateArr);
    this.audioWinRate = getAverage(this.audioWinRateArr);
    this.commonWinRate = getAverage(this.commonWinRateArr);
  }

  private setAmountOfNewWords(userWord: UserWord, currentDate: number): void {
    if (getWordFirstDate(userWord.optional.sprintHistory) > currentDate) {
      this.newWordsAmount.sprint += 1;
    }
    if (getWordFirstDate(userWord.optional.gameCallhistory) > currentDate) {
      this.newWordsAmount.gameCall += 1;
    }
  }

  private clearData(): void {
    this.newWordsAmount = new NewAmount();
    this.gameWinsRate = new NewAmount();
    this.sprintSeries = 0;
    this.audioSeries = 0;
    this.sprintWinRate = 0;
    this.audioWinRate = 0;
    this.commonWinRate = 0;
    this.sprintWinRateArr = [];
    this.audioWinRateArr = [];
    this.commonWinRateArr = [];
  }
}
