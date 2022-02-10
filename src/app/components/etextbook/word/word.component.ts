import { Component, Input } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  @Input() public word: Word = {} as Word;
  public url: string = environment.apiUrl;
  public authorized: boolean = false;

  public constructor(private auth: AuthService) {
    this.authorized = auth.checkAuth();
  }
}
