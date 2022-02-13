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

  private _groupNumber: number = 0;

  private _pageNumber: number = 0;

  public constructor(private wordsService: WordsService) {
    this.hardWordsPageNumber = 6;
  }

  @Input() public set groupNumber(groupNumber: number) {
    this._groupNumber = groupNumber;
    this.init();
  }

  @Input() public set pageNumber(pageNumber: number) {
    this._pageNumber = pageNumber;
    this.init();
  }

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    if (this._groupNumber === this.hardWordsPageNumber) {
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
}
