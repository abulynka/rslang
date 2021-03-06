import { Component, HostListener, OnInit } from '@angular/core';
import {
  Word,
  Question,
  Answer,
  AnimalSVG,
} from 'src/app/interfaces/interfaces';
import { GamesStatesService } from 'src/app/services/games-states.service';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { WordsService } from 'src/app/services/words.service';
import { environment } from 'src/environments/environment';

let timeOut: ReturnType<typeof setTimeout>;

function getQuestions(words: Word[]): Question[] {
  const questions: Question[] = [];

  function getIndex(size: number, i: number): number {
    const number: number = Math.round(Math.random() * size);
    if (size === 0) return 0;
    return number === i ? getIndex(size, i) : number;
  }

  words.forEach((word: Word, i: number, arr: Word[]): void => {
    const doChage: boolean = !Math.round(Number(Math.random()));
    const indexToChange: number = getIndex(arr.length - 1, i);
    const newQuestion: Question = {
      isTrue: !doChage,
      wrongTranslate: word.wordTranslate,
      wordData: word,
    };
    if (doChage) {
      newQuestion.wrongTranslate = arr[indexToChange].wordTranslate;
    }
    questions.push(newQuestion);
  });

  return questions;
}

@Component({
  selector: 'app-sprint-game',
  templateUrl: './sprint-game.component.html',
  styleUrls: ['./sprint-game.component.scss'],
})
export class SprintGameComponent implements OnInit {
  public questions: Question[] = [];
  public answers: Answer[] = [];
  public correctAnswers: Word[] = [];
  public wrongAnswers: Word[] = [];
  public wordNumber: number = 0;
  public timer: number = 0;
  public score: number = 0;
  public rightNumbers: number = 0;
  public state: string = '';
  public isFullScreen: boolean = false;
  public isMuteSound: boolean = true;
  public answer: boolean | null = null;
  public animals: AnimalSVG[];
  public assetsURL: string = '../../../assets';

  private group: string = '0';
  private page: string = '0';
  private audioObj: HTMLAudioElement = new Audio();

  public constructor(
    private wordsService: WordsService,
    private gameStateService: GamesStatesService,
    private userProgressService: UserProgressService
  ) {
    this.state = this.gameStateService.state;
    this.animals = [
      {
        src: '../../../assets/svg/monky.svg',
        alt: 'mnky',
      },
    ];
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'ArrowLeft') {
      this.checkWord(false);
    } else if (event.code === 'ArrowRight') {
      this.checkWord(true);
    } else if (event.code === 'KeyF') {
      this.makeFullScreen();
    } else if (event.code === 'Space') {
      if (this.questions.length === 0) {
        return;
      }
      this.playSound(this.questions[this.wordNumber].wordData);
    }
  }

  public ngOnInit(): void {
    if (!this.gameStateService.isOpenedFromMenu) {
      this.startGame();
    }
  }

  public startGame(): void {
    this.state = 'process';
    this.timer = 60;
    this.group = this.gameStateService.group;
    this.page = this.gameStateService.page;
    this.getWords();
  }

  public setTimer(): void {
    const time: number = 1000;
    if (!this.timer || this.state === 'end') {
      this.checkWord();
      this.state = 'end';
      return;
    }
    this.timer -= 1;
    setTimeout(() => this.setTimer(), time);
  }

  public playSound(word: Word): void {
    this.audioObj.src = `${environment.apiUrl}/${word.audio}`;
    this.audioObj.load();
    this.audioObj.play().catch(() => {
      // empty
    });
  }

  public checkWord(userAnswer?: boolean): void {
    const question: Question = this.questions[this.wordNumber];

    if (!question) return;

    const answer: boolean = question.isTrue === userAnswer;
    const wordAnswer: Answer = {
      answer,
      ...question.wordData,
    };

    this.userProgressService.checkWord(wordAnswer, 'sprint');
    if (answer) {
      this.correctAnswers.push(question.wordData);
    } else {
      this.wrongAnswers.push(question.wordData);
    }
    this.answers.push(wordAnswer);
    this.setRightAnswer(answer);
    this.nextWord();
  }

  public toggleVolume(): void {
    this.isMuteSound = !this.isMuteSound;
  }

  public makeFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
    let elem: Element = document.documentElement;
    if (this.isFullScreen) elem.requestFullscreen.call(elem);
    else document.exitFullscreen();
  }

  public restartGame(): void {
    this.state = this.gameStateService.state;
    this.answers = [];
    this.questions = [];
    this.wordNumber = 0;
    this.score = 0;
    this.timer = 60;
    this.rightNumbers = 0;
    this.ngOnInit();
  }

  private getWords(): void {
    this.wordsService
      .getWords(this.group, this.page, this.gameStateService.isOpenedFromMenu)
      .subscribe((words: Word[]) => {
        const number: number = Number('20') - this.questions.length;
        let newWords: Word[] = words;
        if (number < Number('20')) {
          newWords = newWords.slice(0, number + 1);
        }
        this.questions = this.questions.concat(getQuestions(newWords));
        if (this.timer.toString() === '60') {
          this.setTimer();
        }
        this.checkWordNumber();
      });
  }

  private nextWord(): void {
    this.wordNumber += 1;

    if (this.wordNumber === this.questions.length) {
      this.state = 'end';
      return;
    }
    this.checkWordNumber();
  }

  private checkWordNumber(): void {
    const preAmountOfWords: number = 5;
    if (
      this.gameStateService.isOpenedFromMenu &&
      this.wordNumber >= Number('20')
    ) {
      this.state = 'end';
      this.questions = [];
      return;
    }
    // ???????? ???????????????? 4 ?????????? ??, ???? ?????????????????? ??????????????????
    if (
      this.wordNumber >= this.questions.length - preAmountOfWords &&
      this.page !== '0' &&
      this.questions.length !== Number('20')
    ) {
      this.page = (parseInt(this.page) - 1).toString();
      this.getWords();
    } else if (this.questions.length === 0) {
      this.state = 'end';
    }
  }

  private setRightAnswer(checkedAnswer: boolean): void {
    const rightNumbers: number = 3;
    const clearTime: number = 500;
    this.setWindow(checkedAnswer);

    if (checkedAnswer) {
      this.rightNumbers += 1;
      this.score += 10;
    } else {
      this.rightNumbers = 0;
      this.animals = this.animals.slice(0, 1);
    }

    if (this.rightNumbers === rightNumbers) {
      this.score += 20;
      if (this.animals.length.toString() <= '4') {
        this.animals.push({
          src: `${this.assetsURL}/svg/${this.animals.length.toString()}.svg`,
          alt: '',
        });
      }
      setTimeout(() => (this.rightNumbers = 0), clearTime);
    }
  }

  private setWindow(answer: boolean): void {
    this.answer = answer;

    if (answer) {
      this.audioObj.src = `${this.assetsURL}/sounds/good.mp3`;
    } else {
      this.audioObj.src = `${this.assetsURL}/sounds/mistake.mp3`;
    }

    if (!this.isMuteSound) {
      this.audioObj.play().catch(() => {
        // empty
      });
    }
    this.clearWindowClass();
  }

  private clearWindowClass(): void {
    const time: number = 300;
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      this.answer = null;
    }, time);
  }
}
