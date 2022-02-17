import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChapterComponent } from '../chapter/chapter.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';
import { GamesStatesService } from '../../../services/games-states.service';

@Component({
  selector: 'app-etextbook',
  templateUrl: './etextbook.component.html',
  styleUrls: ['./etextbook.component.scss'],
})
export class EtextbookComponent implements AfterViewInit {
  @ViewChild(ChapterComponent) private chapter: ChapterComponent | undefined;
  @ViewChild(MatPaginator) private paginator: MatPaginator | undefined;

  public selectedChapter: number;
  public selectedPage: number = 0;
  public loading: boolean = false;

  public chapters: Array<Record<string, string | number>> = [
    {
      name: 'Раздел 1',
      index: 0,
    },
    {
      name: 'Раздел 2',
      index: 1,
    },
    {
      name: 'Раздел 3',
      index: 2,
    },
    {
      name: 'Раздел 4',
      index: 3,
    },
    {
      name: 'Раздел 5',
      index: 4,
    },
    {
      name: 'Раздел 6',
      index: 5,
    },
  ];

  private readonly keys: Record<string, string> = {
    chapter: 'etextbookcomponent-chapter',
    page: 'etextbookcomponent-page',
  };

  public constructor(
    public auth: AuthService,
    public game: GamesStatesService
  ) {
    this.loading = true;
    if (this.isAuthorized()) {
      this.chapters.push({
        name: 'Сложные слова',
        index: 6,
      });
    }

    this.selectedChapter = parseInt(
      sessionStorage.getItem(this.keys['chapter']) || ''
    );
    if (this.selectedChapter > this.chapters.length) {
      this.selectedChapter = 0;
    }

    this.selectedPage = parseInt(
      sessionStorage.getItem(this.keys['page']) || '0'
    );

    this.changeChapter(this.selectedChapter, this.selectedPage);
  }

  public isAuthorized(): boolean {
    return this.auth.checkAuth();
  }

  public ngAfterViewInit(): void {
    this.changeChapter(this.selectedChapter, this.selectedPage);
  }

  public changePageEvent(event: PageEvent): PageEvent {
    const page: number = event.pageIndex;
    this.selectedPage = page;
    sessionStorage.setItem(this.keys['page'], page.toString());
    this.changeChapter(this.selectedChapter, this.selectedPage);
    return event;
  }

  public changeChapterEvent(
    chapterEvent: MatOptionSelectionChange<string | number>
  ): void {
    if (chapterEvent.isUserInput) {
      const chapter: number = parseInt(`${chapterEvent.source.value}`);
      this.selectedChapter = chapter;
      sessionStorage.setItem(this.keys['chapter'], chapter.toString());
      this.changeChapter(this.selectedChapter, this.selectedPage);
    }
  }

  public startAudioGame(): void {
    this.game.startAudioGameFromBook(
      this.selectedChapter.toString(),
      this.selectedPage.toString()
    );
  }

  public startSprintGame(): void {
    this.game.startSprintFromBook(
      this.selectedChapter.toString(),
      this.selectedPage.toString()
    );
  }

  private changeChapter(chapter: number, page: number): void {
    if (this.chapter) {
      this.chapter.setChapter(chapter, page);
    }
  }
}
