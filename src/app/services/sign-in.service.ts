import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { UserInfo } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  public constructor(private httpService: HttpService) {}

  public singIn(email: string, password: string): Observable<unknown> {
    const data: UserInfo = {
      email,
      password,
    };
    return this.httpService.http.post(`${this.httpService.url}/signin`, data);
  }
}
