import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { Answer, Word } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnChanges {
  @Input() public answers: Answer[] = [];
  @Input() public score: number = 0;
  @Input() public wrongAnswers: Word[] = [];
  @Input() public correctAnswers: Word[] = [];
  @Output() public clicked: EventEmitter<string> = new EventEmitter();

  public route: string = '';

  private audio: HTMLAudioElement = new Audio();

  public constructor(private router: Router) {}

  public ngOnChanges(): void {
    this.route = this.router.url;
  }
  public reastartGame(): void {
    this.clicked.emit();
  }

  public playSound(audioUrl: string): void {
    this.audio.src = `${environment.apiUrl}/${audioUrl}`;
    this.audio.load();
    this.audio.play();
  }
}
