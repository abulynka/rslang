import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Word } from '../../../interfaces/interfaces';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  private static audiosGlobal: HTMLAudioElement[] = [];
  private static listGlobal: HTMLElement = {} as HTMLElement;

  @Input() public word: Word = {} as Word;

  private audio: HTMLAudioElement = new Audio();
  private audioMeaning: HTMLAudioElement = new Audio();
  private audioExample: HTMLAudioElement = new Audio();
  private audios: HTMLAudioElement[] = [
    this.audio,
    this.audioMeaning,
    this.audioExample,
  ];
  private list: HTMLElement = {} as HTMLElement;

  public constructor(
    private element: ElementRef,
    private httpService: HttpService
  ) {}

  public async onClick(): Promise<void> {
    if (AudioComponent.audiosGlobal.length > 0) {
      AudioComponent.audiosGlobal.forEach((audio: HTMLAudioElement) => {
        audio.pause();
        audio.currentTime = 0;
      });

      AudioComponent.listGlobal.classList.remove('fa-pause');
      AudioComponent.listGlobal.classList.add('fa-play');

      if (AudioComponent.audiosGlobal === this.audios) {
        AudioComponent.audiosGlobal = [];
      } else {
        AudioComponent.audiosGlobal = this.audios;
        await this.playAudio();
      }
    } else {
      await this.playAudio();
    }
  }

  public ngOnDestroy(): void {
    this.audios.forEach((audio: HTMLAudioElement) => {
      audio.pause();
    });
  }

  public ngOnInit(): void {
    this.list = this.element.nativeElement.querySelector('i');

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
      this.list.classList.remove('fa-pause');
      this.list.classList.add('fa-play');
    });
  }

  private async playAudio(): Promise<void> {
    this.list.classList.remove('fa-play');
    this.list.classList.add('fa-pause');
    AudioComponent.audiosGlobal = this.audios;
    AudioComponent.listGlobal = this.list;
    try {
      await this.audio.play();
    } catch (event) {
      // empty
    }
  }
}
