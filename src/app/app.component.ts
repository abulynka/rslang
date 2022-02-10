import { Component, DoCheck } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './components/change-route-animation';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeChangeAnimation],
})
export class AppComponent implements DoCheck {
  public title: string = 'rslang';
  public userName: string = '';
  public isAuthUser: boolean = false;

  public constructor(private authService: AuthService) { }

  public ngDoCheck(): void {
    const userData = this.authService.getUserData();
    this.isAuthUser = false;

    if (userData) {
      this.userName = userData.name;
      this.isAuthUser = true;
    }
  }

  public logOut(): void {
    this.authService.deleteUserData();
    this.isAuthUser = false;
  }

  public getRouteAnimationState(outlet: RouterOutlet): RouterOutlet {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
