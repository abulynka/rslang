import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  public constructor(private httpService: HttpService) {}

  public createUser(user: User): Observable<unknown> {
    return this.httpService.http.post(`${this.httpService.url}/users`, user);
  }
}
