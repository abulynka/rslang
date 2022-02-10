import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  protected email: string = '';
  protected password: string = '';
  protected rPassword: string = '';
  protected isSent: boolean = false;

  protected constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  protected send(): void {
    const user: User = {
      name: 'To-Do',
      email: this.email,
      password: this.password,
    };
    this.isSent = true;
    this.httpService.createUser(user).subscribe(() => {
      this.isSent = false;
      this.router.navigate(['/signin']);
    });
  }
}
