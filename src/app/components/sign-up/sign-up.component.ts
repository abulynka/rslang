import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { SignUpService } from '../../services/sign-up.service';
import {
  FormControl,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  public hide: boolean = true;
  public isSent: boolean = false;
  public isUserExist: boolean = false;
  public formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(Number('3')),
      Validators.maxLength(Number('12')),
      Validators.pattern(/^[A-Za-zА-я]{3,}$/i),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(
        /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i
      ),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(Number('8')),
      Validators.pattern(/[a-zA-Z\d].{8,}$/i),
    ]),
  });

  public constructor(
    private signUpService: SignUpService,
    private router: Router
  ) {}

  public get emailControl(): AbstractControl {
    return this.formGroup.get('email') as AbstractControl;
  }

  public get nameControl(): AbstractControl {
    return this.formGroup.get('name') as AbstractControl;
  }

  public get passwordControl(): AbstractControl {
    return this.formGroup.get('password') as AbstractControl;
  }

  public send(): void {
    const user: User = {
      name: this.nameControl.value,
      email: this.emailControl.value,
      password: this.passwordControl.value,
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
