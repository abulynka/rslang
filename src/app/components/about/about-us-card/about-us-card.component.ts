import { Component, Input } from '@angular/core';
import { AboutUsCard } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-about-us-card',
  templateUrl: './about-us-card.component.html',
  styleUrls: ['./about-us-card.component.scss'],
})
export class AboutUsCardComponent {
  @Input() public aboutUsCard: AboutUsCard = {} as AboutUsCard;

  public getImagePath(): string {
    return `../../../../assets/${this.aboutUsCard.image}`;
  }

  public getGitHubUserName(): string {
    return this.aboutUsCard.gitHub.split('/').reverse()[0];
  }
}
