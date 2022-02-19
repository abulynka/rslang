import { Component } from '@angular/core';
import { UserWordStatistics, Word } from '../../../interfaces/interfaces';
import { UserProgressService } from '../../../services/user-progress.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  public word: Word = {} as Word;

  public displayedColumns: string[] = ['game', 'right', 'wrong'];
  public dataSource: Array<Record<string, number | string>> = [
    { game: 'Аудиовызов', right: 0, wrong: 0 },
    { game: 'Спринт', right: 0, wrong: 0 },
  ];

  public constructor(public userProgress: UserProgressService) {}

  public init(word: Word): void {
    this.word = word;

    this.userProgress
      .getUserWordStatistics(this.word.id)
      .subscribe((statistics: UserWordStatistics) => {
        this.dataSource[0]['right'] = statistics.audioGame.rightAnswers;
        this.dataSource[0]['wrong'] = statistics.audioGame.wrongAnswers;
        this.dataSource[1]['right'] = statistics.sprintGame.rightAnswers;
        this.dataSource[1]['wrong'] = statistics.sprintGame.wrongAnswers;
      });
  }
}
