import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Word } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  public constructor(private httpService: HttpService) {}

  public getWord(id: string): Observable<Word> {
    return this.httpService.http.get(
      this.httpService.getUrl(`/words/${id}`)
    ) as Observable<Word>;
  }

  public getWords(group: string, page: string): Observable<Word[]> {
    const params: HttpParams = new HttpParams()
      .set('group', group)
      .set('page', page);

    return this.httpService.http.get(this.httpService.getUrl('/words'), {
      params,
    }) as Observable<Word[]>;
  }
}
