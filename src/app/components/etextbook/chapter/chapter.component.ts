import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  @Input() public chapter: number = 0;

  @ViewChild(PageComponent, { static: true }) private page:
    | PageComponent
    | undefined;

  public ngOnInit(): void {
    return;
  }

  public setChapter(chapter: number, page: number): void {
    if (this.page) {
      this.page.setGroupPageNumber(chapter, page);
    }
  }
}
