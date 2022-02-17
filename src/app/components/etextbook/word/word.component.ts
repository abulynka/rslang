import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { UserProgressService } from '../../../services/user-progress.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StatisticsComponent } from '../statistics/statistics.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  @Input() public isDisabledDifficult: boolean = false;
  @Input() public isDisabledLearned: boolean = false;

  @Output() public removeWordEvent: EventEmitter<Word> =
    new EventEmitter<Word>();

  public url: string = environment.apiUrl;

  private _difficultChapter: boolean = false;

  private difficult: HTMLElement | undefined;

  private learned: HTMLElement | undefined;

  private _word: Word = {} as Word;

  public constructor(
    private auth: AuthService,
    public httpService: HttpService,
    private userProgress: UserProgressService,
    private element: ElementRef,
    public dialog: MatDialog
  ) {}

  public get word(): Word {
    return this._word;
  }

  public get difficultTitle(): string {
    if (this._difficultChapter) {
      return 'Убрать из сложных';
    }
    return 'Отметить как сложное';
  }

  @Input() public set word(word: Word) {
    this._word = word;
  }

  @Input() public set difficultChapter(difficultChapter: boolean) {
    this._difficultChapter = difficultChapter;
    if (this._difficultChapter) {
      this.isDisabledDifficult = false;
    }
  }

  @ViewChild('wordControls') public set wordControls(element: any) {
    if (element) {
      this.difficult = element.nativeElement.querySelector(
        '.word__controls-button[difficult]'
      );

      this.learned = this.element.nativeElement.querySelector(
        '.word__controls-button[learned]'
      );

      if (this.auth.checkAuth()) {
        this.userProgress
          .checkTheWordDifficult(this._word.id)
          .pipe(
            catchError(() => {
              return [];
            })
          )
          .subscribe((difficult: boolean) => {
            if (difficult) {
              this.makeDifficultUI(!this._difficultChapter);
            }
          });

        this.userProgress
          .checkTheWordLearned(this._word.id)
          .pipe(
            catchError(() => {
              return [];
            })
          )
          .subscribe((learned: boolean) => {
            if (learned) {
              this.makeLearnedUI();
            }
          });
      }
    }
  }

  public openStatistics(): void {
    const obj: MatDialogRef<StatisticsComponent> =
      this.dialog.open(StatisticsComponent);
    obj.componentInstance.init(this._word);
  }

  public isAuthorized(): boolean {
    return this.auth.checkAuth();
  }

  public clickDifficult(): void {
    if (this._difficultChapter) {
      this.userProgress
        .makeTheWordEasy(this._word.id)
        .subscribe(() => this.removeWordEvent.next(this._word));
    } else {
      this.userProgress
        .makeTheWordDifficult(this._word.id)
        .subscribe(() => this.makeDifficultUI());
    }
  }

  public makeLearned(): void {
    this.userProgress
      .makeTheWordLearned(this._word.id)
      .subscribe(() => this.makeLearnedUI());
  }

  private makeDifficultUI(disable: boolean = true): void {
    this.difficult?.classList.add('word__controls-button_difficult');
    this.isDisabledDifficult = disable;
  }

  private makeLearnedUI(): void {
    this.learned?.classList.add('word__controls-button_learned');
    this.isDisabledLearned = true;
  }
}
