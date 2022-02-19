import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
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
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (!err.ok) {
            this.insertStatisticsData({
              learnedWords: 0,
              optional: {
                sprintSeriesOfAnswers: 0,
                audioSeriesOfAnswers: 0,
              },
            });
          }
          return [];
        })
      )
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
    this.audio.play();
  }

  private insertStatisticsData(data: UserStatistics): void {
    const series: number = this.getTheBiggestSeries();
    if (
      this.gameName === 'sprint' &&
      data.optional.sprintSeriesOfAnswers < series
    ) {
      data.optional.sprintSeriesOfAnswers = series;
    } else if (data.optional.audioSeriesOfAnswers < series) {
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
    return series.sort().reverse()[0];
  }
}
