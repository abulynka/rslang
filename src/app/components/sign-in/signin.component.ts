import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {}

  send() {
    this.httpService
      .singIn(this.email, this.password)
      .pipe(
        map((data) => data),
        catchError((err) => {
          console.log(err);
          return [];
        })
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
