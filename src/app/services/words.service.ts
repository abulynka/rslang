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

  public getHardWords(): Observable<Word[]> {
    return this.getAggregatedWords(
      undefined,
      undefined,
      JSON.stringify({
        $or: [{ 'userWord.difficulty': 'hard' }],
      }),
      '3600'
    );
  }

  public getAllLearnedWords(): Observable<Word[]> {
    return this.getAggregatedWords(
      undefined,
      undefined,
      JSON.stringify({ 'userWord.optional.isLearned': true })
    );
  }

  public getWords(
    group: string,
    page: string,
    isfromMenu: boolean = true
  ): Observable<Word[]> {
    const params: HttpParams = new HttpParams()
      .set('group', group)
      .set('page', page);

    if (this.auth.checkAuth() && isfromMenu === false) {
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
    const filterObj: { [key: string]: string | number } = {};
    if (group) {
      filterObj['group'] = Number(group);
    }
    if (page) {
      filterObj['page'] = Number(page);
    }
    Object.assign(filterObj, JSON.parse(filter || '{}'));

    const params: HttpParams = new HttpParams()
      .set('wordsPerPage', wordsPerPage || '20')
      .set('filter', JSON.stringify(filterObj));

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
