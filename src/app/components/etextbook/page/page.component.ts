import { Component, OnInit } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { WordsService } from '../../../services/words.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  public words: Word[] = [];
  private groupNumber: number = 0;
  private pageNumber: number = 0;

  public constructor(private wordsService: WordsService) {}

  public ngOnInit(): void {
    this.wordsService
      .getWords(this.groupNumber.toString(), this.pageNumber.toString())
      .subscribe((words: Word[]) => {
        this.words = words;
      });
  }
}
