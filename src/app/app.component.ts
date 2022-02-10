import { Component, DoCheck } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './components/change-route-animation';
import { Auth } from './interfaces/interfaces';
import { AuthService } from './services/auth.service';
import { GamesStatesService } from './services/games-states.service';

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
  public userLoginTime: number | null = null;

  public constructor(
    private authService: AuthService,
    private gamesStatesService: GamesStatesService
  ) {}

  public ngDoCheck(): void {
    if (this.authService.sessionIsOver()) {
      this.isAuthUser = false;
      this.authService.deleteUserData();
    }
    const userData: Auth | null = this.authService.getUserData();
    this.isAuthUser = false;

    if (!this.userLoginTime) {
      this.userLoginTime = this.authService.getSessionTime();
    }

    if (userData) {
      this.userName = userData.name;
      this.isAuthUser = true;
    }
  }

  public logOut(): void {
    this.authService.deleteUserData();
    this.isAuthUser = false;
  }

  public setGameState(): void {
    this.gamesStatesService.isOpenedFormMenu = true;
  }

  public getRouteAnimationState(outlet: RouterOutlet): RouterOutlet {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
