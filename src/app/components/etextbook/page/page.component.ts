import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { WordsService } from '../../../services/words.service';
import { EtextbookService } from '../../../services/etextbook.service';
import { UserProgressService } from '../../../services/user-progress.service';
import { Observable, zip } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Output() public pageIsLearned: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public readonly hardWordsPageNumber: number;

  public difficultChapter: boolean = false;

  private _words: Word[] = [];

  private _groupNumber: number = 0;

  private _pageNumber: number = 0;

  public constructor(
    private wordsService: WordsService,
    private etextbookService: EtextbookService,
    private userProgress: UserProgressService,
    private element: ElementRef,
    private auth: AuthService
  ) {
    this.hardWordsPageNumber = 6;
    this._groupNumber = this.etextbookService.getDefaultChapter();
    this._pageNumber = this.etextbookService.getDefaultPage();
  }

  public get words(): Word[] {
    return this._words;
  }

  public set words(words: Word[]) {
    this._words = words;

    this.checkIsLearned();
  }

  @Input() public setGroupPageNumber(
    groupNumber: number,
    pageNumber: number
  ): void {
    this._groupNumber = groupNumber;
    this._pageNumber = pageNumber;
    const difficultChapterConst: number = 6;
    this.difficultChapter = this._groupNumber === difficultChapterConst;
    this.init();
  }

  public checkIsLearned(): void {
    if (this.auth.checkAuth()) {
      const checks: Array<Observable<boolean>> = this._words.map(
        (word: Word): Observable<boolean> => {
          return this.userProgress.checkTheWordLearned(word.id);
        }
      );

      zip(checks).subscribe((results: boolean[]) => {
        const isLearned: boolean = results.every((result: boolean) => result);
        this.pageIsLearned.emit(isLearned);
        this.setLearnedPage(isLearned);
      });
    }
  }

  public init(): void {
    if (this._groupNumber === this.hardWordsPageNumber) {
      this.words = [];
      this.wordsService.getHardWords().subscribe((words: Word[]) => {
        this.words = words;
      });
    } else {
      this.wordsService
        .getWords(this._groupNumber.toString(), this._pageNumber.toString())
        .subscribe((words: Word[]) => {
          this.words = words;
        });
    }
  }

  public removeWord(word: Word): void {
    this.words.some((value: Word, key: number) => {
      if (this.words[key].id === word.id) {
        this.words.splice(key, 1);
        return true;
      }
      return false;
    });
  }

  private setLearnedPage(isLearned: boolean): void {
    if (isLearned) {
      this.element.nativeElement.firstChild.classList.add('page_disable');
    } else {
      this.element.nativeElement.firstChild.classList.remove('page_disable');
    }
  }
}
