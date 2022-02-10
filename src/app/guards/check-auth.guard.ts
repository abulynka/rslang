import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthGuard implements CanActivate {
  public constructor(private authService: AuthService){}
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const path: string = route.url['0'].path;
    if (path === 'signup' || path === 'signin') {
      return !this.authService.checkAuth();
    }
    return this.authService.checkAuth();
  }
  
}
