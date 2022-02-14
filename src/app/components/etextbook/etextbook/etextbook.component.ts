import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChapterComponent } from '../chapter/chapter.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-etextbook',
  templateUrl: './etextbook.component.html',
  styleUrls: ['./etextbook.component.scss'],
})
export class EtextbookComponent implements OnInit, AfterViewInit {
  @ViewChild(ChapterComponent) private chapter: ChapterComponent | undefined;
  @ViewChild(MatPaginator) private paginator: MatPaginator | undefined;

  public chapters: Array<{ [key: string]: string | number }> = [
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

  public selectedChapter: number = 0;
  public selectedPage: number = 0;

  private readonly keys: Record<string, string> = {
    chapter: 'etextbookcomponent-chapter',
    page: 'etextbookcomponent-page',
  };

  public constructor(public auth: AuthService) {}

  public ngOnInit(): void {
    if (this.auth.checkAuth()) {
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
      sessionStorage.getItem(this.keys['page']) || ''
    );
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

  private changeChapter(chapter: number, page: number): void {
    if (this.chapter) {
      this.chapter.setChapter(chapter, page);
      const hardChapter: number = 6;
      if (chapter === hardChapter) {
        if (this.paginator) {
          this.paginator.length = 1;
          this.paginator.showFirstLastButtons = false;
          const maxPageSizeOptions: number = 3600;
          this.paginator.pageSize = maxPageSizeOptions;
          this.paginator.pageSizeOptions = [maxPageSizeOptions];
        }
      }
    }
  }
}
