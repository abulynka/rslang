import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  email: string = '';
  password: string = '';
  rPassword: string = '';
  isSent: boolean = false;

  constructor(private httpService: HttpService, private router: Router ) { }

  ngOnInit(): void {
  }

  send() {
    const user: User = {
      name: 'To-Do',
      email: this.email,
      password: this.password,
    }
    this.isSent = true;
    this.httpService.createUser(user).subscribe(() => {
      this.isSent = false;
      this.router.navigate(['/signin']);
    });
  }
}
