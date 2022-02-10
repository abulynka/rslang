import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { SignUpService } from '../../services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  public userName: string = '';
  public email: string = '';
  public password: string = '';
  public isSent: boolean = false;
  public isUserExist: boolean = false;

  public constructor(
    private signUpService: SignUpService,
    private router: Router
  ) {}

  public send(): void {
    const user: User = {
      name: this.userName,
      email: this.email,
      password: this.password,
    };
    this.isSent = true;
    this.signUpService
      .createUser(user)
      .pipe(
        catchError(() => {
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
