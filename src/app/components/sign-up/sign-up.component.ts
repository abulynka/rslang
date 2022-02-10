import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  public email: string = '';
  public password: string = '';
  public rPassword: string = '';
  public isSent: boolean = false;
  public isUserExist: boolean = false;

  public constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  public send(): void {
    const user: User = {
      name: 'To-Do',
      email: this.email,
      password: this.password,
    };
    this.isSent = true;
    this.httpService
      .createUser(user)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.setBoolean(true);
          return [];
        })
      )
      .subscribe(() => {
        this.setBoolean(false);
        this.router.navigate(['/signin']);
      });
  }

  private setBoolean(isUserExist: boolean): void {
    this.isUserExist = isUserExist;
    this.isSent = false;
  }
}
