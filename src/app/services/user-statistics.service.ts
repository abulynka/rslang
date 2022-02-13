import { Injectable } from '@angular/core';
import { UserWord, Word } from '../interfaces/interfaces';
import { WordsService } from './words.service';

class NewAmount {
  public sprint: number = 0;
  public gameCall: number = 0;
  public common = (average: number = 1): number =>
    (this.sprint + this.gameCall) / average;
}

@Injectable({
  providedIn: 'root',
})
export class UserStatisticsService {
  public userWords: Word[] = [];
  public newWordsAmount: NewAmount = new NewAmount();
  public gameWinsRate: NewAmount = new NewAmount();
  public sprintSeries: number = 0;
  public audioSeries: number = 0;

  public constructor(private wordsService: WordsService) {}

  public getWords(cb: () => void): void {
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
        this.userWords = data;
        this.setStatisticsData();
        cb();
      });
  }

  private setStatisticsData(): void {
    const date: Date = new Date();
    const currentDate: number = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

    this.userWords.forEach((word: Word) => {
      const userWord: UserWord | undefined = word.userWord;
      if (userWord) {
        this.setAmountOfNewWords(userWord, currentDate);
        this.setSeriesOfAnswers(userWord);
        this.setWinRate(userWord);
      }
    });
  }

  private setSeriesOfAnswers(userWord: UserWord): void {}

  private setWinRate(userWord: UserWord): void {}

  private setAmountOfNewWords(userWord: UserWord, currentDate: number): void {
    if (
      Number(Object.keys(userWord.optional.sprintHistory || {})[0]) >
      currentDate
    ) {
      this.newWordsAmount.sprint += 1;
    }
    if (
      Number(Object.keys(userWord.optional.gameCallhistory || {})[0]) >
      currentDate
    ) {
      this.newWordsAmount.gameCall += 1;
    }
  }
}
