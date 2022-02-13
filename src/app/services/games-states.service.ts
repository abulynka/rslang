import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamesStatesService {
  public group: string = '0';
  public page: string = '0';
  public state: string = 'start';
  private _isOpenedFormMenu: boolean = true;

  public get isOpenedFormMenu(): boolean {
    return this._isOpenedFormMenu;
  }

  public set isOpenedFormMenu(value: boolean) {
    this._isOpenedFormMenu = value;
    this.state = 'start';
    if (!this._isOpenedFormMenu) {
      this.state = 'process';
    }
  }

  public setRandomPage(): string {
    const pagesAmount: number = 29;
    this.page = Math.round(Math.random() * pagesAmount).toString();
    return this.page;
  }
}
