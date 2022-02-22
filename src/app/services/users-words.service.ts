import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { UserWord, UserWordResult } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersWordsService {
  public constructor(private httpService: HttpService) {}

  public getAll(userId: string): Observable<UserWordResult[]> {
    return this.httpService.get(`/users/${userId}/words`) as Observable<
      UserWordResult[]
    >;
  }

  public get(userId: string, wordId: string): Observable<UserWordResult> {
    return this.httpService.get(
      `/users/${userId}/words/${wordId}`
    ) as Observable<UserWordResult>;
  }

  public insert(
    userId: string,
    wordId: string,
    userWord: UserWord
  ): Observable<UserWordResult> {
    return this.httpService.post(`/users/${userId}/words/${wordId}`, userWord);
  }

  public update(
    userId: string,
    wordId: string,
    userWord: UserWord
  ): Observable<UserWordResult> {
    return this.httpService.put(`/users/${userId}/words/${wordId}`, userWord);
  }

  public delete(userId: string, wordId: string): Observable<void> {
    return this.httpService.delete(`/users/${userId}/words/${wordId}`);
  }
}
