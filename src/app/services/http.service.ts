import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserInfo } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private url: string = 'https://rs-lang-angular.herokuapp.com';
  protected constructor(private http: HttpClient) {}

  public createUser(user: User): Observable<unknown> {
    return this.http.post(`${this.url}/users`, user);
  }

  public singIn(email: string, password: string): Observable<unknown> {
    const data: UserInfo = {
      email,
      password,
    };
    return this.http.post(`https://rs-lang-angular.herokuapp.com/signin`, data);
  }
}
