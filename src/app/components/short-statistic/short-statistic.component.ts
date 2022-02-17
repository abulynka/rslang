import { Component, OnInit } from '@angular/core';
import { ChartData, UserStatistics } from 'src/app/interfaces/interfaces';
import { Word } from '../../interfaces/interfaces';
import { UserStatisticsService } from 'src/app/services/user-statistics.service';

const width: number = 600;
const height: number = 500;
@Component({
  selector: 'app-short-statistic',
  templateUrl: './short-statistic.component.html',
  styleUrls: ['./short-statistic.component.scss'],
})
export class ShortStatisticComponent implements OnInit {
  public width: number = width;
  public height: number = height;
  public gradient: boolean = false;
  public isLoaded: boolean = false;
  public sprint: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 0,
    },
    {
      name: 'Процент правильных ответов, (%)',
      value: 0,
    },
    {
      name: 'Cамая длинная серия правильных ответов',
      value: 0,
    },
  ];

  public audio: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 0,
    },
    {
      name: 'Процент правильных ответов, (%)',
      value: 0,
    },
    {
      name: 'Cамая длинная серия правильных ответов',
      value: 0,
    },
  ];

  public words: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 0,
    },
    {
      name: 'количество изученных слов за день',
      value: 0,
    },
    {
      name: 'процент правильных ответов за день',
      value: 0,
    },
  ];
  public jokes: string[] = [
    'Собираем некоторые сведения о вас',
    'Пожалуйста подождите, идет взлом пентагона',
    'Вот вот загрузится',
  ];
  public joke: string = this.getJoke();
  public constructor(private statisticsService: UserStatisticsService) {}

  public ngOnInit(): void {
    this.statisticsService.getUserWords(() => {
      this.sprint[0].value = this.statisticsService.newWordsAmount.sprint;
      this.audio[0].value = this.statisticsService.newWordsAmount.gameCall;
      this.words[0].value = this.statisticsService.newWordsAmount.common();
      this.setSeriesOfAnswers();
      this.setAmountOfNewWords();
      this.updateWinRate();
      this.updateDataArrays();
      this.isLoaded = true;
    });
  }

  public setAmountOfNewWords(): void {
    this.statisticsService
      .getLearnedWordsPerADay()
      .subscribe((data: Word[]) => {
        this.words[1].value = data.length || 0;
        this.words = [...this.words];
      });
  }

  private getJoke(): string {
    return this.jokes[Math.round(Math.random() * (this.jokes.length - 1))];
  }

  private setSeriesOfAnswers(): void {
    const setData = (numSprint: number, numAudio: number): void => {
      this.sprint[2].value = numSprint || 0;
      this.audio[2].value = numAudio || 0;
      this.updateDataArrays();
    };
    this.statisticsService
      .getUserStatistics()
      .subscribe((data: UserStatistics) => {
        setData(
          data.optional.sprintSeriesOfAnswers,
          data.optional.audioSeriesOfAnswers
        );
      });
  }

  private updateWinRate(): void {
    this.sprint[1].value = this.statisticsService.sprintWinRate;
    this.audio[1].value = this.statisticsService.audioWinRate;
    this.words[2].value = this.statisticsService.commonWinRate;
    this.updateDataArrays();
  }

  private updateDataArrays(): void {
    this.sprint = [...this.sprint];
    this.audio = [...this.audio];
    this.words = [...this.words];
  }
}
