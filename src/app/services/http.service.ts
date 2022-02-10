import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public url: string = environment.apiUrl;
  public constructor(public http: HttpClient, private auth: AuthService) {}

  public get(path: string): Observable<any> {
    return this.http.get(this.getUrl(path), this.getBearerHeader());
  }

  public post(path: string, data: any): Observable<any> {
    return this.http.post(this.getUrl(path), data, this.getBearerHeader());
  }

  public put(path: string, data: any): Observable<any> {
    return this.http.put(this.getUrl(path), data, this.getBearerHeader());
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(this.getUrl(path), this.getBearerHeader());
  }

  public getUrl(path: string): string {
    let addPath: string = path;
    if (path[0] !== '/') {
      addPath = `/${path}`;
    }
    return `${this.url}${addPath}`;
  }

  private getBearerHeader(): {
    headers: HttpHeaders;
  } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getUserData()?.token}`,
      }),
    };
  }
}
