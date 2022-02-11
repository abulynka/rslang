import { Component, Input, OnInit } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { WordsService } from '../../../services/words.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  @Input() public groupNumber: number = 0;
  @Input() public pageNumber: number = 0;
  public words: Word[] = [];

  public constructor(private wordsService: WordsService) {}

  public ngOnInit(): void {
    this.wordsService
      .getWords(this.groupNumber.toString(), this.pageNumber.toString())
      .subscribe((words: Word[]) => {
        this.words = words;
      });
  }
}
