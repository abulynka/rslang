import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { Answer, UserWord, UserWordResult } from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { UsersWordsService } from './users-words.service';

const checkLearnedWord = (
  userWord: UserWordResult,
  answersInRow: number
): boolean => {
  const easyLimit: number = 3;
  const hardLimit: number = 5;

  if (userWord.difficulty === 'easy' && answersInRow >= easyLimit) {
    return true;
  }
  if (userWord.difficulty === 'hard' && answersInRow >= hardLimit) {
    return true;
  }
  return false;
};

@Injectable({
  providedIn: 'root',
})
export class UserProgressService {
  private gameName: string = '';

  public constructor(
    private userWordsService: UsersWordsService,
    private auth: AuthService
  ) {}

  public checkWord(answer: Answer, gameName: string): void {
    if (!this.auth.checkAuth()) return;
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

  public makeTheWordLearned(wordId: string): void {
    if (!this.auth.checkAuth()) return;
    this.userWordsService
      .get(this.auth.getCurrentUserId(), wordId)
      .subscribe((word: UserWordResult) => {
        word.difficulty = 'easy';
        word.optional.isLearned = true;
        this.userWordsService
          .update(this.auth.getCurrentUserId(), word.wordId, word)
          .subscribe();
      });
  }

  private updateUserWord(answer: Answer, userWord: UserWordResult): void {
    const wordId: string = answer.id || <string>answer['_id'];
    const answersInRow: number = answer.answer
      ? userWord.optional.countOfAnswersInRow + 1
      : 0;
    const isLearned: boolean = checkLearnedWord(userWord, answersInRow);
    const newUserWord: UserWord = {
      difficulty: isLearned ? 'easy' : userWord.difficulty,
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
        difficulty: 'easy',
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
