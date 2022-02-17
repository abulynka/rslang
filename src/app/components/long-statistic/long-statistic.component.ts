import { Component, OnInit } from '@angular/core';
import { ChartData } from 'src/app/interfaces/interfaces';
import { UserStatisticsService } from 'src/app/services/user-statistics.service';

interface LongChartData {
  name: string;
  series: ChartData[];
}
@Component({
  selector: 'app-long-statistic',
  templateUrl: './long-statistic.component.html',
  styleUrls: ['./long-statistic.component.scss'],
})
export class LongStatisticComponent implements OnInit {
  public width: number = Number('600');
  public height: number = Number('400');
  public gradient: boolean = false;
  public newWordsPerEveryDay: LongChartData[] = [];
  public newWordsPerEveryDayIntegral: ChartData[] = [];

  public constructor(private statisticsService: UserStatisticsService) {
    this.newWordsPerEveryDay = [
      {
        name: 'новых слов',
        series: [{ name: '', value: 0 }],
      },
    ];

    this.newWordsPerEveryDayIntegral = [{ name: '', value: 0 }];
  }

  public ngOnInit(): void {
    this.statisticsService.getUserWords(() => {
      this.newWordsPerEveryDay[0].series.push(
        ...this.statisticsService.getAmountOfNewWordsForEachDay()
      );
      this.newWordsPerEveryDayIntegral.push(
        ...this.statisticsService.getNumberByIncreaseWords()
      );
      this.newWordsPerEveryDayIntegral = [...this.newWordsPerEveryDayIntegral];
      this.newWordsPerEveryDay = [...this.newWordsPerEveryDay];
    });
  }
}
