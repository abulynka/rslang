import { Component, DoCheck } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
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
  public isFooterHidden: boolean = false;

  public constructor(
    private authService: AuthService,
    private gamesStatesService: GamesStatesService,
    private router: Router
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
    this.checkURL();
  }

  public logOut(): void {
    this.authService.deleteUserData();
    this.isAuthUser = false;
    this.router.navigateByUrl('');
  }

  public setGameState(): void {
    this.gamesStatesService.startFromHeader();
  }

  public getRouteAnimationState(outlet: RouterOutlet): RouterOutlet {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  public adaptiveMenu(): void {
    const navbar: HTMLElement = document.querySelector(
      '.navbar'
    ) as HTMLElement;
    navbar.classList.toggle('active');
  }

  public closeMenuList(e: Event): void {
    let target: HTMLElement = e.target as HTMLElement;
    const navbar: HTMLElement = document.querySelector(
      '.navbar'
    ) as HTMLElement;
    if (target.closest('.menu-item')) {
      navbar.classList.remove('active');
    }
  }

  private checkURL(): void {
    const routePath: string = this.router.url.split('').slice(1).join('');
    this.isFooterHidden = false;
    this.router.config
      .filter((route: Route) =>
        route.data ? route.data['isFooterHidden'] : false
      )
      .forEach((route: Route) => {
        if (route.path === routePath) {
          this.isFooterHidden = true;
        }
      });
  }
}

  // this.menuLink.forEach(n => n.addEventListener('click', () => {
  // this.closeMenuList();
  // }));
