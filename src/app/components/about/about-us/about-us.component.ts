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
      description: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
      name: 'Yulia',
      gitHub: 'https://github.com/YuliyaBondar',
      position: 'Разработчик',
      image: 'julia.jpg',
      description: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
      name: 'Egor',
      gitHub: 'https://github.com/cheerfulperson',
      position: 'Разработчик',
      image: 'egor.jpg',
      description: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
  ];
}
