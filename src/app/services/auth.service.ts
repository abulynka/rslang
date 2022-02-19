import { Injectable } from '@angular/core';
import { Auth } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public setUserData(data: Auth): void {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('userLoginTime', Date.now().toString());
  }

  public updateUserData(
    data: Omit<Auth, 'message' | 'token' | 'refreshToken' | 'userId' | 'name'>
  ): void {
    const userData: Auth = this.getUserData() as Auth;
    localStorage.setItem('user', JSON.stringify(Object.assign(userData, data)));
  }

  public getUserData(): Auth | null {
    const user: string | null = localStorage.getItem('user');
    return user ? (JSON.parse(user) as Auth) : null;
  }

  public getCurrentUserId(): string {
    return this.getUserData()?.userId || '';
  }

  public deleteUserData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userLoginTime');
  }

  public getUserImage(): string {
    return localStorage.getItem('userImage') || '../assets/user.png';
  }

  public setUserimage(base64Url: string): void {
    localStorage.setItem('userImage', base64Url);
  }

  public getSessionTime(): number {
    return parseInt(localStorage.getItem('userLoginTime') || '0');
  }

  public sessionIsOver(): boolean {
    const sessionTime: number = Date.now() - this.getSessionTime();
    const number: number = 1.44e7;
    return sessionTime >= number;
  }

  public checkAuth(): boolean {
    return Boolean(this.getUserData());
  }
}
