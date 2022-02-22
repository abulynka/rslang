import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Answer, Word, UserStatistics } from 'src/app/interfaces/interfaces';
import { UserStatisticsService } from 'src/app/services/user-statistics.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnChanges, OnInit {
  @Input() public answers: Answer[] = [];
  @Input() public score: number = 0;
  @Input() public gameName: string = '';
  @Input() public wrongAnswers: Word[] = [];
  @Input() public correctAnswers: Word[] = [];
  @Output() public clicked: EventEmitter<string> = new EventEmitter();

  public route: string = '';

  private audio: HTMLAudioElement = new Audio();

  public constructor(
    private router: Router,
    private userStatistics: UserStatisticsService
  ) {}

  public ngOnInit(): void {
    this.userStatistics
      .getUserStatistics()
      .subscribe((data: UserStatistics) => {
        this.insertStatisticsData(data);
      });
  }

  public ngOnChanges(): void {
    this.route = this.router.url;
  }

  public reastartGame(): void {
    this.clicked.emit();
  }

  public playSound(audioUrl: string): void {
    this.audio.src = `${environment.apiUrl}/${audioUrl}`;
    this.audio.load();
    this.audio.play().catch(() => {
      // empty
    });
  }

  private insertStatisticsData(data: UserStatistics): void {
    const series: number = this.getTheBiggestSeries();
    if (
      this.gameName === 'sprint' &&
      data.optional.sprintSeriesOfAnswers < series
    ) {
      data.optional.sprintSeriesOfAnswers = series;
    }
    if (
      this.gameName === 'audioGame' &&
      data.optional.audioSeriesOfAnswers < series
    ) {
      data.optional.audioSeriesOfAnswers = series;
    }
    this.userStatistics.updatUserStatistics(data);
  }

  private getTheBiggestSeries(): number {
    const series: number[] = [];
    let theBiggestSeries: number = 0;
    this.answers.forEach((value: Answer, i: number) => {
      const nextAnswer: Answer | undefined = this.answers[i + 1];
      if (value.answer === true) {
        theBiggestSeries += 1;
      } else {
        theBiggestSeries = 0;
      }
      if (!nextAnswer || nextAnswer.answer === false) {
        series.push(theBiggestSeries);
      }
    });
    return Math.max(...series);
  }
}
