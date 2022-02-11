import { Component } from '@angular/core';

@Component({
  selector: 'app-long-statistic',
  templateUrl: './long-statistic.component.html',
  styleUrls: ['./long-statistic.component.scss']
})
export class LongStatisticComponent {
  public width: number = 500;
  public height: number = 400;
  public gradient: boolean = false;

  public newWordsPerEveryDay() {
    return [
      {
        "name": "",
        "series": [
          {
            "value": 6514,
            "name": "2016-09-19T01:32:34.395Z"
          },
          {
            "value": 4119,
            "name": "2016-09-16T15:37:42.769Z"
          },
          {
            "value": 3107,
            "name": "2016-09-17T14:47:40.306Z"
          },
          {
            "value": 2693,
            "name": "2016-09-23T13:49:17.652Z"
          },
          {
            "value": 5780,
            "name": "2016-09-14T13:43:43.119Z"
          }
        ]
      },
    ];
  }

  public newWordsPerEveryDayIntegral() {
    return [
      {
        "name": "",
        "series": [
          {
            "value": 4,
            "name": "2016-09-19T01:32:34.395Z"
          },
          {
            "value": 6,
            "name": "2016-09-16T15:37:42.769Z"
          },
          {
            "value": 9,
            "name": "2016-09-17T14:47:40.306Z"
          },
          {
            "value": 30,
            "name": "2016-09-23T13:49:17.652Z"
          },
          {
            "value": 150,
            "name": "2016-09-14T13:43:43.119Z"
          }
        ]
      },
    ];
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toString();
  }
}