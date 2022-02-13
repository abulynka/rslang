import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { UserProgressService } from '../../../services/user-progress.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  @Input() public isDisabledDifficult: boolean = false;
  @Input() public isDisabledLearned: boolean = false;

  public url: string = environment.apiUrl;

  private difficult: HTMLElement | undefined;

  private learned: HTMLElement | undefined;

  private _word: Word = {} as Word;

  public constructor(
    private auth: AuthService,
    public httpService: HttpService,
    private userProgress: UserProgressService,
    private element: ElementRef
  ) {}

  public get word(): Word {
    return this._word;
  }

  @Input() public set word(word: Word) {
    this._word = word;
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
          .subscribe((difficult: boolean) => {
            if (difficult) {
              this.makeDifficultUI();
            }
          });

        this.userProgress
          .checkTheWordLearned(this._word.id)
          .subscribe((learned: boolean) => {
            if (learned) {
              this.makeLearnedUI();
            }
          });
      }
    }
  }

  public isAuthorized(): boolean {
    return this.auth.checkAuth();
  }

  public makeDifficult(): void {
    this.userProgress
      .makeTheWordDifficult(this._word.id)
      .subscribe(() => this.makeDifficultUI());
  }

  public makeLearned(): void {
    this.userProgress
      .makeTheWordLearned(this._word.id)
      .subscribe(() => this.makeLearnedUI());
  }

  private makeDifficultUI(): void {
    this.difficult?.classList.add('word__controls-button_difficult');
    this.isDisabledDifficult = true;
  }

  private makeLearnedUI(): void {
    this.learned?.classList.add('word__controls-button_learned');
    this.isDisabledLearned = true;
  }
}
