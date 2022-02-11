import { Component, Input } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  @Input() public word: Word = {} as Word;
  public url: string = environment.apiUrl;

  public constructor(
    private auth: AuthService,
    public httpService: HttpService
  ) {}
}
