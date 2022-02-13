import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subscriber } from 'rxjs';
import { Answer, UserWord, UserWordResult } from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { UsersWordsService } from './users-words.service';

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

  private static convertUserWordResultToUserWord(
    wordResult: UserWordResult
  ): UserWord {
    const { id, wordId, ...word } = { ...wordResult };
    return word;
  }

  public makeTheWordDifficult(wordId: string): Observable<void> {
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
          const word: UserWord = UserProgressService.convertUserWordResultToUserWord(wordResult);
          word.difficulty = this.difficulty.hard;

          this.userWordsService
            .update(this.auth.getCurrentUserId(), wordResult.wordId, word)
            .subscribe(() => {
              observer.next();
            });
        });
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
                    wordHistory: {},
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

  private insertDefaultUserWord(wordId: string): Observable<UserWordResult> {
    return this.userWordsService.insert(this.auth.getCurrentUserId(), wordId, {
      difficulty: this.difficulty.easy,
      optional: {
        countOfAnswersInRow: 0,
        isLearned: false,
        wordHistory: {},
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
        wordHistory: Object.assign(userWord.optional.wordHistory, {
          [Date.now()]: {
            isRight: answer.answer,
            gameName: this.gameName,
          },
        }),
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
          wordHistory: {
            [Date.now()]: {
              isRight: answer.answer,
              gameName: this.gameName,
            },
          },
        },
      })
      .subscribe();
  }
}
