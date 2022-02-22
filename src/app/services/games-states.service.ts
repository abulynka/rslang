import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GamesStatesService {
  public group: string = '0';
  public page: string = '0';
  public state: string = 'start';
  private _isOpenedFormMenu: boolean = true;

  public constructor(private router: Router) {}

  public get isOpenedFromMenu(): boolean {
    return this._isOpenedFormMenu;
  }

  public set isOpenedFromMenu(value: boolean) {
    this._isOpenedFormMenu = value;
    this.state = 'start';
    if (!this._isOpenedFormMenu) {
      this.state = 'process';
    }
  }

  public startSprintFromBook(group: string, page: string): void {
    this.setParameters(group, page);
    this.isOpenedFromMenu = false;
    this.router.navigate(['sprint-game']);
  }

  public startAudioGameFromBook(group: string, page: string): void {
    this.setParameters(group, page);
    this.isOpenedFromMenu = false;
    this.router.navigate(['audiocall']);
  }

  public startFromHeader(): void {
    this.isOpenedFromMenu = true;
  }

  public setRandomPage(): string {
    const pagesAmount: number = 29;
    this.page = Math.round(Math.random() * pagesAmount).toString();
    return this.page;
  }

  public setParameters(group: string, page: string): void {
    this.group = group;
    this.page = page;
  }
}
