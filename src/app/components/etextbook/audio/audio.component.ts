import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  @Input() public word: Word = {} as Word;

  private audio: HTMLAudioElement = new Audio();
  private audioMeaning: HTMLAudioElement = new Audio();
  private audioExample: HTMLAudioElement = new Audio();
  private audios: HTMLAudioElement[] = [
    this.audio,
    this.audioMeaning,
    this.audioExample,
  ];
  private isPlayingAudio: boolean = false;

  public constructor(
    private element: ElementRef,
    private httpService: HttpService
  ) {}

  public async onClick(): Promise<void> {
    const list: HTMLElement = this.element.nativeElement.querySelector('i');
    if (this.isPlayingAudio) {
      this.audios.forEach((audio: HTMLAudioElement) => {
        list.classList.remove('fa-pause');
        list.classList.add('fa-play');
        this.isPlayingAudio = false;
        audio.pause();
        audio.currentTime = 0;
      });
    } else {
      list.classList.remove('fa-play');
      list.classList.add('fa-pause');
      this.isPlayingAudio = true;
      try {
        await this.audio.play();
      } catch (event) {
        // empty
      }
    }
  }

  public ngOnDestroy(): void {
    this.audios.forEach((audio: HTMLAudioElement) => {
      audio.pause();
    });
  }

  public ngOnInit(): void {
    const list: HTMLElement = this.element.nativeElement.querySelector('i');

    this.audio.src = this.httpService.getUrl(this.word.audio);
    this.audioMeaning.src = this.httpService.getUrl(this.word.audioMeaning);
    this.audioExample.src = this.httpService.getUrl(this.word.audioExample);

    this.audio.addEventListener('ended', async () => {
      try {
        await this.audioMeaning.play();
      } catch (event) {
        // empty
      }
    });
    this.audioMeaning.addEventListener('ended', async () => {
      try {
        await this.audioExample.play();
      } catch (event) {
        // empty
      }
    });
    this.audioExample.addEventListener('ended', async () => {
      list.classList.remove('fa-pause');
      list.classList.add('fa-play');
    });
  }
}
