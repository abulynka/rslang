import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, Observer } from 'rxjs';
import {
  Auth,
  User,
  UserSettings,
  UserSettingsOptional,
} from '../interfaces/interfaces';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { SignInService } from './sign-in.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  public userId: string = this.auth.getCurrentUserId();

  public constructor(
    private http: HttpService,
    private auth: AuthService,
    private signInService: SignInService,
    private router: Router
  ) {}

  public getUserEmail(): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      this.getUserData().subscribe((data: User) => {
        observer.next(data.email);
      });
    });
  }

  public checkUserPassword(
    email: string,
    password: string
  ): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.signInService
        .singIn(email, password)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (!err.ok) {
              observer.next(false);
            }
            return [];
          })
        )
        .subscribe((data: Auth) => {
          this.auth.updateUserData(data);
          observer.next(true);
        });
    });
  }

  public setUserData(data: Partial<User>): void {
    if (data.name) {
      this.auth.updateUserData({ name: data.name });
    }
    this.http.put(`users/${this.userId}`, data).subscribe();
  }

  public getUserSettings(): Observable<UserSettings> {
    this.userId = this.auth.getCurrentUserId();
    return this.http.get(`/users/${this.userId}/settings`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (!err.ok) {
          this.updateUserSettings({});
        }
        return [];
      })
    );
  }

  public updateUserSettings(userData: UserSettingsOptional): void {
    this.auth.setUserSettings(userData);
    this.http
      .put(`/users/${this.userId}/settings`, {
        wordsPerDay: 1,
        optional: userData,
      })
      .subscribe();
  }

  public deleteUserAccaunt(): void {
    this.http.delete(`users/${this.userId}`).subscribe();
    this.auth.deleteUserData();
    this.router.navigate(['']);
  }

  private getUserData(): Observable<User> {
    return this.http.get(`users/${this.userId}`);
  }
}
