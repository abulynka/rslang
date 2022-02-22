import { Component, DoCheck } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './components/change-route-animation';
import {
  AboutUsCard,
  Auth,
  UserSettings,
  UserSettingsOptional,
} from './interfaces/interfaces';
import { AuthService } from './services/auth.service';
import { GamesStatesService } from './services/games-states.service';
import { UserSettingsService } from './services/user-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeChangeAnimation],
})
export class AppComponent implements DoCheck {
  public title: string = 'rslang';
  public isAuthUser: boolean = false;
  public userLoginTime: number | null = null;
  public isFooterHidden: boolean = false;
  public userImageUrl: string = '';
  public isSettingsSetted: boolean = false;
  public userName: string = '';
  public lastName: string = '';
  public shellColor: string = 'primary';
  public bgUrl: string = '../assets/bg/unsplesh.jfif';

  public aboutUsArray: Array<Pick<AboutUsCard, 'name' | 'gitHub'>> = [
    {
      name: 'abulynka',
      gitHub: 'https://github.com/abulynka',
    },
    {
      name: 'YuliyaBondar',
      gitHub: 'https://github.com/YuliyaBondar',
    },
    {
      name: 'cheerfulperson',
      gitHub: 'https://github.com/cheerfulperson',
    },
  ];

  public constructor(
    private authService: AuthService,
    private gamesStatesService: GamesStatesService,
    private router: Router,
    private userSettings: UserSettingsService
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
      this.setUserSettings();
    }
    this.checkURL();
    this.checkUserSettings();
  }

  public logOut(): void {
    this.authService.deleteUserData();
    this.isAuthUser = false;
    this.router.navigateByUrl('').then();

    this.shellColor = 'primary';
    this.bgUrl = '../assets/bg/unsplesh.jfif';
    this.lastName = '';
    this.isSettingsSetted = false;
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

  private setUserSettings(): void {
    if (this.isSettingsSetted || !this.isAuthUser) return;
    this.isSettingsSetted = true;
    this.userSettings
      .getUserSettings()
      .subscribe((settingsData: UserSettings) => {
        if (settingsData.optional) {
          this.authService.setUserSettings(settingsData.optional);
        }
        this.userImageUrl = settingsData.optional?.image || '';
      });
  }
  private checkUserSettings(): void {
    if (!this.isAuthUser) return;
    const optional: UserSettingsOptional = this.authService.getUserSettings();
    if (optional.lastName) {
      this.lastName = optional.lastName;
    }
    if (optional.shellColor) {
      this.shellColor = optional.shellColor;
    }
    if (optional.bgUrl) {
      this.bgUrl = optional.bgUrl;
    }
    if (optional.image) {
      this.userImageUrl = optional.image;
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
