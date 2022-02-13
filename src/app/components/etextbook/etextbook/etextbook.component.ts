import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChapterComponent } from '../chapter/chapter.component';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-etextbook',
  templateUrl: './etextbook.component.html',
  styleUrls: ['./etextbook.component.scss'],
})
export class EtextbookComponent {
  @ViewChild(ChapterComponent, { static: true }) private chapter:
    | ChapterComponent
    | undefined;

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
    {
      name: 'Сложные слова',
      index: 6,
    },
  ];

  public selectedChapter: number = 0;

  public changePage(event: PageEvent): PageEvent {
    if (this.chapter) {
      this.chapter.setPage(event.pageIndex);
    }
    return event;
  }

  public changeChapter(
    chapterEvent: MatOptionSelectionChange<string | number>
  ): void {
    if (chapterEvent.isUserInput && this.chapter) {
      const chapter: number = parseInt(`${chapterEvent.source.value}`);
      this.chapter.setChapter(chapter);

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
