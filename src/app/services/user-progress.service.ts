import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subscriber } from 'rxjs';
import {
  Answer,
  UserWord,
  UserWordOptional,
  UserWordResult,
  UserWordStatistics,
  WordHistoryUnit,
} from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { UsersWordsService } from './users-words.service';

type WordHistoryType = Pick<
  UserWordOptional,
  'sprintHistory' | 'gameCallhistory'
>;

@Injectable({
  providedIn: 'root',
})
export class UserProgressService {
  private gameName: string = '';

  private readonly difficulty: any = {
    hard: 'hard',
    easy: 'easy',
  };

  public constructor(
    private userWordsService: UsersWordsService,
    private auth: AuthService
  ) {}

  private static convertUserWordResultToUserWord(
    wordResult: UserWordResult
  ): UserWord {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/typedef
    const { id, wordId, ...word } = { ...wordResult };
    return word;
  }

  public getUserWordStatistics(wordId: string): Observable<UserWordStatistics> {
    return new Observable((observer: Subscriber<UserWordStatistics>) => {
      if (!this.auth.checkAuth()) {
        return;
      }

      this.userWordsService
        .get(this.auth.getCurrentUserId(), wordId)
        .pipe(
          catchError(() => {
            return [];
          })
        )
        .subscribe((data: UserWord) => {
          const result: UserWordStatistics = {
            id: wordId,
            audioGame: {
              gameName: 'sprint',
              rightAnswers: 0,
              wrongAnswers: 0,
            },
            sprintGame: {
              gameName: 'audiocall',
              rightAnswers: 0,
              wrongAnswers: 0,
            },
          } as UserWordStatistics;

          if (data.optional.sprintHistory) {
            const keys: string[] = Object.keys(data.optional.sprintHistory);
            for (const key of keys) {
              if (data.optional.sprintHistory[key].isRight) {
                result.sprintGame.rightAnswers += 1;
              } else {
                result.sprintGame.wrongAnswers += 1;
              }
            }
          }

          if (data.optional.gameCallhistory) {
            const keys: string[] = Object.keys(data.optional.gameCallhistory);
            for (const key of keys) {
              if (data.optional.gameCallhistory[key].isRight) {
                result.audioGame.rightAnswers += 1;
              } else {
                result.audioGame.wrongAnswers += 1;
              }
            }
          }

          observer.next(result);
        });
    });
  }

  public checkWord(answer: Answer, gameName: string): void {
    if (!this.auth.checkAuth()) {
      return;
    }
    const wordId: string = answer.id || <string>answer['_id'];

    this.gameName = gameName;
    this.userWordsService
      .get(this.auth.getCurrentUserId(), wordId)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (!err.ok) {
            this.insertUserWord(answer);
          }
          return [];
        })
      )
      .subscribe((data: UserWordResult) => {
        this.updateUserWord(answer, data);
      });
  }

  public checkTheWordDifficult(wordId: string): Observable<boolean> {
    return new Observable((observer: Subscriber<boolean>) => {
      this.userWordsService
        .get(this.auth.getCurrentUserId(), wordId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (!err.ok) {
              this.insertDefaultUserWord(wordId).subscribe();
            }
            return [];
          })
        )
        .subscribe((word: UserWordResult) => {
          observer.next(word.difficulty === this.difficulty.hard);
        });
    });
  }

  public makeTheWordLearned(wordId: string): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      if (!this.auth.checkAuth()) return;

      this.userWordsService
        .get(this.auth.getCurrentUserId(), wordId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (!err.ok) {
              this.userWordsService
                .insert(this.auth.getCurrentUserId(), wordId, {
                  difficulty: this.difficulty.easy,
                  optional: {
                    countOfAnswersInRow: 0,
                    isLearned: true,
                  },
                })
                .subscribe();
            }
            return [];
          })
        )
        .subscribe((wordResult: UserWordResult) => {
          const word: UserWord =
            UserProgressService.convertUserWordResultToUserWord(wordResult);

          word.optional.isLearned = true;
          word.difficulty = this.difficulty.easy;

          this.userWordsService
            .update(this.auth.getCurrentUserId(), wordResult.wordId, word)
            .subscribe(() => {
              observer.next();
            });
        });
    });
  }

  public checkTheWordLearned(wordId: string): Observable<boolean> {
    return new Observable((observer: Subscriber<boolean>) => {
      this.userWordsService
        .get(this.auth.getCurrentUserId(), wordId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (!err.ok) {
              this.insertDefaultUserWord(wordId).subscribe();
            }
            return [];
          })
        )
        .subscribe((word: UserWordResult) => {
          observer.next(word.optional.isLearned);
        });
    });
  }

  public makeTheWordEasy(wordId: string): Observable<void> {
    return this.makeTheWordDifficultEasy(wordId, this.difficulty.easy);
  }

  public makeTheWordDifficult(wordId: string): Observable<void> {
    return this.makeTheWordDifficultEasy(wordId, this.difficulty.hard);
  }

  private makeTheWordDifficultEasy(
    wordId: string,
    level: string
  ): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      if (!this.auth.checkAuth()) {
        return;
      }

      this.userWordsService
        .get(this.auth.getCurrentUserId(), wordId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (!err.ok) {
              this.insertDefaultUserWord(wordId).subscribe();
            }
            return [];
          })
        )
        .subscribe((wordResult: UserWordResult) => {
          const word: UserWord =
            UserProgressService.convertUserWordResultToUserWord(wordResult);
          word.difficulty = level;

          this.userWordsService
            .update(this.auth.getCurrentUserId(), wordResult.wordId, word)
            .subscribe(() => {
              observer.next();
            });
        });
    });
  }

  private insertDefaultUserWord(wordId: string): Observable<UserWordResult> {
    return this.userWordsService.insert(this.auth.getCurrentUserId(), wordId, {
      difficulty: this.difficulty.easy,
      optional: {
        countOfAnswersInRow: 0,
        isLearned: false,
      },
    });
  }

  private checkLearnedWord(
    userWord: UserWordResult,
    answersInRow: number
  ): boolean {
    const easyLimit: number = 3;
    const hardLimit: number = 5;

    if (
      userWord.difficulty === this.difficulty.easy &&
      answersInRow >= easyLimit
    ) {
      return true;
    }
    return (
      userWord.difficulty === this.difficulty.hard && answersInRow >= hardLimit
    );
  }

  private getWordHistory(
    answer: boolean,
    userWord?: UserWordResult
  ): WordHistoryType {
    const wordHistory: WordHistoryType = {
      sprintHistory: userWord ? userWord.optional.sprintHistory || {} : {},
      gameCallhistory: userWord ? userWord.optional.gameCallhistory || {} : {},
    };

    const assignAnswer = (obj: WordHistoryUnit): WordHistoryUnit => {
      return Object.assign(obj, {
        [Date.now()]: {
          isRight: answer,
          gameName: this.gameName,
        },
      });
    };

    if (this.gameName === 'sprint') {
      wordHistory.sprintHistory = assignAnswer(wordHistory.sprintHistory || {});
    } else {
      wordHistory.gameCallhistory = assignAnswer(
        wordHistory.gameCallhistory || {}
      );
    }
    return wordHistory;
  }

  private updateUserWord(answer: Answer, userWord: UserWordResult): void {
    const wordId: string = answer.id || <string>answer['_id'];
    const answersInRow: number = answer.answer
      ? userWord.optional.countOfAnswersInRow + 1
      : 0;

    const isLearned: boolean = this.checkLearnedWord(userWord, answersInRow);
    const newUserWord: UserWord = {
      difficulty: isLearned ? this.difficulty.easy : userWord.difficulty,
      optional: {
        countOfAnswersInRow: answersInRow,
        isLearned: isLearned,
        ...this.getWordHistory(answer.answer, userWord),
      },
    };
    this.userWordsService
      .update(this.auth.getCurrentUserId(), wordId, newUserWord)
      .subscribe();
  }

  private insertUserWord(answer: Answer): void {
    const wordId: string = answer.id || <string>answer['_id'];

    this.userWordsService
      .insert(this.auth.getCurrentUserId(), wordId, {
        difficulty: this.difficulty.easy,
        optional: {
          countOfAnswersInRow: answer.answer ? 1 : 0,
          isLearned: false,
          ...this.getWordHistory(answer.answer),
        },
      })
      .subscribe();
  }
}
