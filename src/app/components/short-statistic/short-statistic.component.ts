import { Component } from '@angular/core';

@Component({
  selector: 'app-short-statistic',
  templateUrl: './short-statistic.component.html',
  styleUrls: ['./short-statistic.component.scss'],
})
export class ShortStatisticComponent {
  public width: number = 500;
  public height: number = 400;
  public gradient: boolean = false;

  public sprint: any = [
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

  public audio: any = [
    {
      name: 'Количество новых слов за день',
      value: 32,
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

  public words: any = [
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
}
