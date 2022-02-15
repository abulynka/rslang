import { Component, HostListener, OnInit } from '@angular/core';
import { Answer, QuestionAudioCall, Word } from 'src/app/interfaces/interfaces';
import { GamesStatesService } from 'src/app/services/games-states.service';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { WordsService } from 'src/app/services/words.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss'],
})
export class AudiocallGameComponent implements OnInit {
  public words: Word[] = [];
  public wordNumber: number = 0;
  public state: string = '';
  public questions: QuestionAudioCall[] = [];
  public correctAnswers: Word[] = [];
  public wrongAnswers: Word[] = [];
  public randomWordsArr: Word[] = [];
  public url: string = environment.apiUrl;
  public isCorrect: boolean = false;
  public totalAmount: number = this.questions.length;
  private group: string = '0';
  private page: string = '0';
  private audioObj: HTMLAudioElement = new Audio();
  private answerBullets: string[] = new Array(this.totalAmount).fill('');
  private digitsIsActive: boolean = true;

  public constructor(
    private wordsService: WordsService,
    private gamesService: GamesStatesService,
    private userProgressService: UserProgressService
  ) {}

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    const answerBuns: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.answer-btn'
    ) as NodeListOf<HTMLElement>;
    const answerContainer: HTMLElement = document.querySelector(
      '.answer-container'
    ) as HTMLElement;
    const threeIndex: number = 3;
    const fourIndex: number = 4;
    if (event.key === '1' && this.digitsIsActive === true) {
      this.chooseWord(answerBuns[0]);
    } else if (event.key === '2' && this.digitsIsActive === true) {
      this.chooseWord(answerBuns[1]);
    } else if (event.key === '3' && this.digitsIsActive === true) {
      this.chooseWord(answerBuns[2]);
    } else if (event.key === '4' && this.digitsIsActive === true) {
      this.chooseWord(answerBuns[threeIndex]);
    } else if (event.key === '5' && this.digitsIsActive === true) {
      this.chooseWord(answerBuns[fourIndex]);
    } else if (event.key === 'Enter') {
      if (answerContainer.style.display === 'flex') {
        this.nextQuestion();
      } else {
        this.skipQuestion();
      }
    }
  }
  public ngOnInit(): void {
    if (!this.gamesService.isOpenedFormMenu) {
      this.startGame();
    }
  }

  public startGame(num?: number): void {
    if (num !== undefined) {
      this.gamesService.group = String(num);
      this.page = this.gamesService.setRandomPage();
    }
    this.state = 'process';
    this.group = this.gamesService.group;
    this.page = this.gamesService.page;
    this.initWords();
  }

  public playSound(audioSrc: string): void {
    this.audioObj.src = `${this.url}/${audioSrc}`;
    this.audioObj.load();
    this.audioObj.play();
  }

  public chooseWord(item: HTMLElement): void {
    this.renderAnswer();
    const answerBtns: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.answer-btn'
    ) as NodeListOf<HTMLElement>;
    const circles: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.circle'
    ) as NodeListOf<HTMLElement>;
    answerBtns.forEach((btn: HTMLElement) => btn.classList.add('disabled'));
    if (
      (<string>item.textContent).trim() !==
      this.questions[this.wordNumber].answer.wordTranslate
    ) {
      item.style.background = 'red';
      this.answerBullets[this.wordNumber] = 'red';
      const answerBuns: NodeListOf<HTMLElement> = document.querySelectorAll(
        '.answer-btn'
      ) as NodeListOf<HTMLElement>;
      answerBuns.forEach((btn: HTMLElement) => {
        if (
          (<string>btn.textContent).trim() ===
          this.questions[this.wordNumber].answer.wordTranslate
        ) {
          btn.style.background = 'green';
        }
      });
      this.wrongAnswers.push(this.questions[this.wordNumber].answer);
    } else {
      this.answerBullets[this.wordNumber] = 'green';
      this.isCorrect = true;
      item.style.background = 'green';
      this.correctAnswers.push(this.questions[this.wordNumber].answer);
    }
    this.userProgressService.checkWord(
      { answer: this.isCorrect, ...this.words[this.wordNumber] } as Answer,
      'audiocall'
    );
    circles.forEach((circle: Element, index: number) => {
      const classCircle: string = this.answerBullets[index];
      if (classCircle) circle.classList.add(classCircle);
    });
  }

  public skipQuestion(): void {
    this.renderAnswer();
    const answerBtns: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.answer-btn'
    ) as NodeListOf<HTMLElement>;
    const circles: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.circle'
    ) as NodeListOf<HTMLElement>;
    this.answerBullets[this.wordNumber] = 'yellow';
    answerBtns.forEach((btn: HTMLElement) => {
      if (
        (<string>btn.textContent).trim() ===
        this.questions[this.wordNumber].answer.wordTranslate
      ) {
        btn.style.background = 'green';
      }
      btn.classList.add('disabled');
    });
    this.wrongAnswers.push(this.questions[this.wordNumber].answer);
    circles.forEach((circle: Element, index: number) => {
      const classCircle: string = this.answerBullets[index];
      if (classCircle) circle.classList.add(classCircle);
    });
  }

  public nextQuestion(): void {
    this.wordNumber += 1;
    this.digitsIsActive = true;
    const answerBtns: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.answer-btn'
    ) as NodeListOf<HTMLElement>;
    const answerContainer: HTMLElement = document.querySelector(
      '.answer-container'
    ) as HTMLElement;
    const sound: HTMLElement = document.querySelector('.sound') as HTMLElement;
    const btnNext: HTMLElement = document.querySelector(
      '.btn-next'
    ) as HTMLElement;
    const btnUnknown: HTMLElement = document.querySelector(
      '.btn-unknown'
    ) as HTMLElement;
    if (this.wordNumber < this.totalAmount) {
      this.renderQuestion();
      answerBtns.forEach((item: HTMLElement) => {
        item.style.background = '#0d6efd';
        item.classList.remove('disabled');
      });
      answerContainer.style.display = 'none';
      sound.style.display = 'block';
      btnNext.style.display = 'none';
      btnUnknown.style.display = 'flex';
    } else {
      this.state = 'end';
      return;
    }
  }

  public restartGame(): void {
    const resultPopup: HTMLElement = document.querySelector(
      '.result-popup'
    ) as HTMLElement;
    const questionContainer: HTMLElement = document.querySelector(
      '.question-container'
    ) as HTMLElement;
    const rulesContainer: HTMLElement = document.querySelector(
      '.rules-container'
    ) as HTMLElement;
    resultPopup.style.display = 'none';
    questionContainer.style.display = 'none';
    rulesContainer.style.display = 'flex';
    this.state = this.gamesService.state;
    this.words = [];
    this.questions = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.answerBullets = [];
    this.randomWordsArr = [];
    this.wordNumber = 0;
    this.digitsIsActive = true;
    this.ngOnInit();
  }

  private initWords(): void {
    const otherAmount: number = 4;
    this.wordsService
      .getWords(this.group, this.gamesService.page)
      .subscribe((words: Word[]) => {
        this.words = words;
        this.totalAmount = this.words.length;
        this.questions = new Array(this.totalAmount)
          .fill(0)
          .map((_: number, index: number) => {
            return {
              answer: this.words[index],
              other: new Array(otherAmount).fill(0).map(() => {
                return this.words[
                  Math.floor(Math.random() * this.words.length)
                ];
              }),
            };
          });
        this.renderQuestion();
      });
  }

  private getRandomWord(question: QuestionAudioCall): Word[] {
    const shuffle = (array: Word[]): Word[] => {
      let currentIndex: number = array.length;
      let temporaryValue: Word;
      let randomIndex: number;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };
    return shuffle([question.answer, ...question.other]);
  }

  private renderQuestion(): void {
    this.randomWordsArr = this.getRandomWord(this.questions[this.wordNumber]);
    this.playSound(this.questions[this.wordNumber].answer.audio);
    const rulesContainer: HTMLElement = document.querySelector(
      '.rules-container'
    ) as HTMLElement;
    const questionContainer: HTMLElement = document.querySelector(
      '.question-container'
    ) as HTMLElement;
    const circles: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.circle'
    ) as NodeListOf<HTMLElement>;
    rulesContainer.style.display = 'none';
    questionContainer.style.display = 'flex';
    circles.forEach((item: Element, index: number) => {
      item.classList.add(`${this.answerBullets[index]}`);
    });
  }

  private renderAnswer(): void {
    this.digitsIsActive = false;
    const answerContainer: HTMLElement = document.querySelector(
      '.answer-container'
    ) as HTMLElement;
    const sound: HTMLElement = document.querySelector('.sound') as HTMLElement;
    const btnNext: HTMLElement = document.querySelector(
      '.btn-next'
    ) as HTMLElement;
    const btnUnknown: HTMLElement = document.querySelector(
      '.btn-unknown'
    ) as HTMLElement;
    const textExample: HTMLElement = document.querySelector(
      '.text-example'
    ) as HTMLElement;
    if (!answerContainer) return;
    answerContainer.style.display = 'flex';
    sound.style.display = 'none';
    btnNext.style.display = 'flex';
    btnUnknown.style.display = 'none';
    textExample.innerHTML = this.questions[this.wordNumber].answer.textExample;
  }
}
