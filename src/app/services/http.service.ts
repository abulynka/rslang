import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public url: string = environment.apiUrl;
  public constructor(public http: HttpClient) {}
}
