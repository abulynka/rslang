import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { GamesStatesService } from 'src/app/services/games-states.service';

@Component({
  selector: 'app-games-start',
  templateUrl: './games-start.component.html',
  styleUrls: ['./games-start.component.scss'],
})
export class GamesStartComponent {
  @Input() public gameName: string = '';
  @Output() public clicked: EventEmitter<string> = new EventEmitter();

  public constructor(private gamesStateService: GamesStatesService) {}

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    const key: number = Number(event.key);
    const limit: number = 6;
    if (key >= 1 && key <= limit) {
      this.startGame(key - 1);
    }
  }

  public startGame(group: number): void {
    this.gamesStateService.group = group.toString();
    this.gamesStateService.setRandomPage();
    this.clicked.emit();
  }
}
