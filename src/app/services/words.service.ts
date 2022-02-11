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
        })
      );
    }

    return this.httpService.http.get(this.httpService.getUrl('/words'), {
      params,
    }) as Observable<Word[]>;
  }

  public getAggregatedWords(
    group: string,
    page: string,
    filter?: string
  ): Observable<Word[]> {
    const params: HttpParams = new HttpParams().set('wordsPerPage', '20').set(
      'filter',
      JSON.stringify({
        group: Number(group),
        page: Number(page),
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
              word.id = <string>word['_id'];
              delete word['_id'];
            }
            return word;
          }) as Word[];
        })
      ) as Observable<Word[]>;
  }
}
