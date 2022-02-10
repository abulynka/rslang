import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SignInService } from '../../services/sign-in.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public email: string = '';
  public password: string = '';
  public isSent: boolean = false;
  public error: string = '';
  public isError: boolean = false;

  public constructor(
    private signInService: SignInService,
    private router: Router,
    private authService: AuthService
  ) {}

  public change(isError: boolean): void {
    this.isError = isError;
    this.isSent = false;
  }

  public send(): void {
    this.isSent = true;
    this.signInService
      .singIn(this.email, this.password)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const code: string = err.status.toString();
          if (code === '403') {
            this.error = 'Неправильный email или пароль!';
          } else if (code === '404') {
            this.error = 'Такого аккаунта не существует!';
          }
          this.change(true);
          return [];
        })
      )
      .subscribe((data: any) => {
        this.change(false);
        if (data.token) {
          this.authService.setUserData(data);
          this.router.navigate(['/']);
        }
      });
  }
}
