import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SignInService } from '../../services/sign-in.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public isSent: boolean = false;
  public error: string = '';
  public isError: boolean = false;
  public hide: boolean = true;
  public emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i
    ),
  ]);
  public pswControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(Number('8')),
    Validators.pattern(/[a-zA-Z\d].{8,}$/i),
  ]);

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
      .singIn(this.emailControl.value, this.pswControl.value)
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
        if (data.token) {
          this.change(false);
          this.authService.setUserData(data);
          this.router.navigate(['/']);
        }
      });
  }
}
