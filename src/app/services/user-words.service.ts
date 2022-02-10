import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Word } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserWordsService {
  public constructor(private httpService: HttpService) {}

  public getWords(userId: string): Observable<Word[]> {
    return this.httpService.http.get(
      this.httpService.getUrl(`/users/${userId}/words`)
    ) as Observable<Word[]>;
  }
}
