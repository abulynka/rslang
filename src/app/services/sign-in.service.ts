import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Auth, UserInfo } from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  public constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  public singIn(email: string, password: string): Observable<unknown> {
    const data: UserInfo = {
      email,
      password,
    };
    return this.httpService.http.post(`${this.httpService.url}/signin`, data);
  }

  public refreshToken(userId: string): void {
    this.httpService.http
      .get(this.httpService.getUrl(`/users/${userId}/tokens`), {
        headers: new HttpHeaders({
          Authorization: `Bearer ${
            this.authService.getUserData()?.refreshToken
          }`,
        }),
      })
      .subscribe((data: unknown) => {
        this.authService.setUserData(data as Auth);
      });
  }
}
