import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  @Output() public pageIsLearned: EventEmitter<boolean> =
    new EventEmitter<boolean>();

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

  public learned(isLearned: boolean): void {
    this.pageIsLearned.emit(isLearned);
  }
}
