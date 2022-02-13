import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Word } from '../interfaces/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  public constructor(
    private httpService: HttpService,
    private auth: AuthService
  ) {}

  public getWord(id: string): Observable<Word> {
    return this.httpService.http.get(
      this.httpService.getUrl(`/words/${id}`)
    ) as Observable<Word>;
  }

  public getWords(
    group: string,
    page: string,
    isfromMenu: boolean = true
  ): Observable<Word[]> {
    const params: HttpParams = new HttpParams()
      .set('group', group)
      .set('page', page);

    if (this.auth.checkAuth() && !isfromMenu) {
      return this.getAggregatedWords(
        group,
        page,
        JSON.stringify({
          $or: [{ 'userWord.optional.isLearned': false }, { userWord: null }],
        }),
        '20'
      );
    }

    return this.httpService.http.get(this.httpService.getUrl('/words'), {
      params,
    }) as Observable<Word[]>;
  }

  public getAggregatedWords(
    group?: string,
    page?: string,
    filter?: string,
    wordsPerPage: string = '4000'
  ): Observable<Word[]> {
    interface Pages {
      group?: number;
      page?: number;
    }
    const pages: Pages = group
      ? { group: Number(group), page: Number(page) }
      : {};

    const params: HttpParams = new HttpParams()
      .set('wordsPerPage', wordsPerPage)
      .set(
        'filter',
        JSON.stringify({
          ...pages,
          ...JSON.parse(filter || '{}'),
        })
      );

    return this.httpService.http
      .get(
        this.httpService.getUrl(
          `/users/${this.auth.getCurrentUserId()}/aggregatedWords`
        ),
        Object.assign(this.httpService.getBearerHeader(), { params })
      )
      .pipe(
        map((data: any) => {
          return data[0].paginatedResults.map((word: Word) => {
            if (word['_id']) {
              word.id = word['_id'];
              delete word['_id'];
            }
            return word;
          }) as Word[];
        })
      );
  }
}
