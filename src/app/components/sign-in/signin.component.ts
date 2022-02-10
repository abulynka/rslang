import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public email: string = '';
  public password: string = '';

  public constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  public send(): void {
    this.httpService
      .singIn(this.email, this.password)
      .pipe(
        map((data: any) => data),
        catchError((err: any) => {
          console.log(err);
          return [];
        })
      )
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
