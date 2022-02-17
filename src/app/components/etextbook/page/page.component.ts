import { Component, Input, OnInit } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { WordsService } from '../../../services/words.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  public words: Word[] = [];

  public readonly hardWordsPageNumber: number;

  public difficultChapter: boolean = false;

  private _groupNumber: number = 0;

  private _pageNumber: number = 0;

  public constructor(private wordsService: WordsService) {
    this.hardWordsPageNumber = 6;
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

  public ngOnInit(): void {
    this.init();
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
}
