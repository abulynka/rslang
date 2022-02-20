import { Component } from '@angular/core';
import { AboutUsCard } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent {
  public command: AboutUsCard[] = [
    {
      name: 'Alex',
      gitHub: 'https://github.com/abulynka',
      position: 'Разработчик',
      image: 'alex.jpg',
      description: [
        'Учебник',
        'Сервисы моделей',
        'Статистика',
        'О команде',
        'Разработка дизайн-компонентов',
      ],
    },
    {
      name: 'Yuliya',
      gitHub: 'https://github.com/YuliyaBondar',
      position: 'Разработчик',
      image: 'julia.jpg',
      description: [
        'Главная страница',
        'Игра "Аудиовызов"',
        'О команде',
        'Разработка дизайна',
        'UI/UX игр',
      ],
    },
    {
      name: 'Egor',
      gitHub: 'https://github.com/cheerfulperson',
      position: 'Разработчик',
      image: 'egor.jpg',
      description: [
        'Игра "Спринт"',
        'Статистика',
        'Настройки профиля',
        'Сервисы моделей и авторизация',
        'Разработка дизайн-компонентов',
      ],
    },
  ];
}
