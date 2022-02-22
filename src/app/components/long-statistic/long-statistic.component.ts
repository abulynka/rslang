import { Component, HostListener, OnInit } from '@angular/core';
import { ChartData } from 'src/app/interfaces/interfaces';
import { UserStatisticsService } from 'src/app/services/user-statistics.service';

const width: number = 700;
const height: number = 600;

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
  public size: [number, number] = [width, height];
  public gradient: boolean = false;
  public isLoaded: boolean = false;
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

  @HostListener('window:resize', ['$event']) public onResize(): void {
    this.resizecharts();
  }

  public ngOnInit(): void {
    this.isLoaded = false;
    this.statisticsService.getUserWords(() => {
      this.newWordsPerEveryDay[0].series.push(
        ...this.statisticsService.getAmountOfNewWordsForEachDay()
      );
      this.newWordsPerEveryDayIntegral.push(
        ...this.statisticsService.getNumberByIncreaseWords()
      );
      this.newWordsPerEveryDayIntegral = [...this.newWordsPerEveryDayIntegral];
      this.newWordsPerEveryDay = [...this.newWordsPerEveryDay];
      this.isLoaded = true;
    });
    this.resizecharts();
  }

  private resizecharts(): void {
    if (window.innerWidth < Number('480')) {
      const sizes: number = 280;
      this.size = [sizes, sizes];
    } else if (window.innerWidth < Number('720')) {
      const sizes: number = 460;
      this.size = [sizes, sizes];
    } else {
      this.size = [width, height];
    }
  }
}
