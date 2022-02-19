import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EtextbookService {
  private readonly keys: Record<string, string> = {
    chapter: 'etextbookcomponent-chapter',
    page: 'etextbookcomponent-page',
  };

  public constructor(private auth: AuthService) {}

  public getDefaultChapter(): number {
    let selectedChapter: number = parseInt(
      sessionStorage.getItem(this.keys['chapter']) || '0'
    );
    const hardChapter: number = 6;
    if (!this.auth.checkAuth() && selectedChapter === hardChapter) {
      return 0;
    }
    return selectedChapter;
  }

  public setDefaultChapter(chapter: number): void {
    sessionStorage.setItem(this.keys['chapter'], chapter.toString());
  }

  public getDefaultPage(): number {
    return parseInt(sessionStorage.getItem(this.keys['page']) || '0');
  }

  public setDefaultPage(page: number): void {
    sessionStorage.setItem(this.keys['page'], page.toString());
  }
}
