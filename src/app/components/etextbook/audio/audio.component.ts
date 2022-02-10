import { Component, Input } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent {
  @Input() public word: Word = {} as Word;
}
