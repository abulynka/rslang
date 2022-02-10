import { Injectable } from '@angular/core';
import { Auth } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // constructor() {}

  public setUserData(data: Auth): void {
    localStorage.setItem('user', JSON.stringify(data));
  }

  public getUserData(): Auth | null {
    const user: string | null = localStorage.getItem('user');
    return user ? (JSON.parse(user) as Auth) : null;
  }
}
