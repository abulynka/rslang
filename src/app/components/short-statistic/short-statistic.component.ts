import { Component, OnInit } from '@angular/core';
import { ChartData } from 'src/app/interfaces/interfaces';
import { UserStatisticsService } from 'src/app/services/user-statistics.service';

const width: number = 500;
const height: number = 400;
@Component({
  selector: 'app-short-statistic',
  templateUrl: './short-statistic.component.html',
  styleUrls: ['./short-statistic.component.scss'],
})
export class ShortStatisticComponent implements OnInit {
  public width: number = width;
  public height: number = height;
  public gradient: boolean = false;
  public sprint: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 8,
    },
    {
      name: 'Процент правильных ответов, (%)',
      value: 12,
    },
    {
      name: 'Cамая длинная серия правильных ответов',
      value: 52,
    },
  ];

  public audio: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 0,
    },
    {
      name: 'Процент правильных ответов, (%)',
      value: 12,
    },
    {
      name: 'Cамая длинная серия правильных ответов',
      value: 15,
    },
  ];

  public words: ChartData[] = [
    {
      name: 'Количество новых слов за день',
      value: 5,
    },
    {
      name: 'количество изученных слов за день',
      value: 30,
    },
    {
      name: 'процент правильных ответов за день',
      value: 4,
    },
  ];

  public constructor(private statisticsService: UserStatisticsService) {}

  public ngOnInit(): void {
    this.statisticsService.getWords(() => {
      this.sprint[0].value = this.statisticsService.newWordsAmount.sprint;
      this.sprint = [...this.sprint];
      this.audio[0].value = this.statisticsService.newWordsAmount.gameCall;
      this.audio = [...this.audio];
      this.words[0].value = this.statisticsService.newWordsAmount.common();
      this.words = [...this.words];
      console.log(this.sprint);
    });
  }
}
