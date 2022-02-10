import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url: string = 'https://rs-lang-angular.herokuapp.com';
  constructor(private http: HttpClient) {}

  createUser(user: User) {
    return this.http.post(`${this.url}/users`, user);
  }

  singIn(email: string, password: string) {
    const data = {
      email,
      password,
    };
    return this.http.post(`https://rs-lang-angular.herokuapp.com/signin`, data);
  }
}
