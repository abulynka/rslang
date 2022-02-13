import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Answer, QuestionAudioCall, Word } from 'src/app/interfaces/interfaces';
import { GamesStatesService } from 'src/app/services/games-states.service';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { WordsService } from 'src/app/services/words.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss']
})
export class AudiocallGameComponent implements OnInit {
  public words: Word[] = [];
  private group: string = '0';
  private page: string = '0';
  public wordNumber: number = 0;
  public state: string = '';
  private audioObj: HTMLAudioElement = new Audio();
  public questions: Array<QuestionAudioCall> = [];
  public correctAnswers: Word[] = [];
  public wrongAnswers: Word[] = [];
  public randomWordsArr: Array<Word> = [];
  public url: string = environment.apiUrl;
  public isCorrect: boolean = false;
  public totalAmount: number = this.questions.length;
  public answerBullets = new Array(this.totalAmount).fill('');
  public correctCount: number = 0;
  public wrongCount: number = 0;
  @Output() public clicked: EventEmitter<string> = new EventEmitter();

  public constructor(private wordsService: WordsService, private gamesService: GamesStatesService, private userProgressService: UserProgressService) { }

  public ngOnInit(): void {
    if (!this.gamesService.isOpenedFormMenu) {
      this.startGame();
    }
  }

  public playSound(audioSrc: string): void {
    this.audioObj.src = `${this.url}/${audioSrc}`;
    this.audioObj.load();
    this.audioObj.play();
  }

  public getRandomWord(question: QuestionAudioCall): Array<Word> {
    const shuffle = (array: Array<Word>): Array<Word> => {
      let currentIndex: number = array.length,
        temporaryValue,
        randomIndex;
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

  private getWords(): void {
    this.wordsService
      .getWords(this.group, this.gamesService.page)
      .subscribe((words: Word[]) => {
        this.words = words;
        this.totalAmount = this.words.length;
        this.questions = new Array(20).fill(0).map((_, index) => {
          return {
            answer: this.words[index],
            other: new Array(4).fill(0).map(() => {
              return this.words[Math.floor(Math.random() * this.words.length)];
            }),
          };
        });
        this.randomWordsArr = this.getRandomWord(this.questions[this.wordNumber]);
        this.playSound(this.questions[this.wordNumber].answer.audio);
      });
  }

  public chooseWord(item: HTMLElement): void {
    const answerContainer = document.querySelector('.answer-container') as HTMLElement;
    const sound = document.querySelector('.sound') as HTMLElement;
    const btnNext = document.querySelector('.btn-next') as HTMLElement;
    const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
    const circles = document.querySelectorAll('.circle') as NodeListOf<HTMLElement>;
    const textExample = document.querySelector('.text-example') as HTMLElement;
    if (!answerContainer) return;
    answerContainer.style.display = 'flex';
    sound.style.display = 'none';
    btnNext.style.display = 'flex';
    btnUnknown.style.display = 'none';
    textExample.innerHTML = this.questions[this.wordNumber].answer.textExample;
    if (item.textContent !== this.questions[this.wordNumber].answer.wordTranslate) {
      item.style.background = 'red';
      this.answerBullets[this.wordNumber] = 'red';
      this.wrongCount++;
      this.wrongAnswers.push(this.questions[this.wordNumber].answer);
    } else {
      this.answerBullets[this.wordNumber] = 'green';
      this.isCorrect = true;
      item.style.background = 'green';
      this.correctCount++;
      this.correctAnswers.push(this.questions[this.wordNumber].answer);
    }
    this.userProgressService.checkWord({answer: this.isCorrect, ...this.words[this.wordNumber]} as Answer, 'audiocall');
    circles.forEach((circle: Element, index: number) => {
      const classCircle = this.answerBullets[index];
      if (classCircle) circle.classList.add(classCircle);
    });
  };

  public renderQuestion(num?: number): void {
    if (num) this.group = String(num);
    this.page = this.gamesService.setRandomPage();
    this.getWords();
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    const circles = document.querySelectorAll('.circle') as NodeListOf<HTMLElement>;
    rulesContainer.style.display = 'none';
    questionContainer.style.display = 'flex';
    circles.forEach((item: Element, index: number) => {
      item.classList.add(`${this.answerBullets[index]}`);
    });
  }

  public startGame(): void {
    this.state = 'process';
    this.group = this.gamesService.group;
    this.page = this.gamesService.page;
    this.getWords();
  }

  public nextQuestion(): void {
    this.wordNumber += 1;
    const answerBtns = document.querySelectorAll('.answer-btn') as NodeListOf<HTMLElement>;
    const answerContainer = document.querySelector('.answer-container') as HTMLElement;
    const sound = document.querySelector('.sound') as HTMLElement;
    const btnNext = document.querySelector('.btn-next') as HTMLElement;
    const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
    const resultPopup = document.querySelector('.result-popup') as HTMLElement;
    if (this.wordNumber < this.totalAmount) {
      this.renderQuestion();
      answerBtns.forEach((item: HTMLElement) => {
        item.style.background = '#0d6efd';
      })
      answerContainer.style.display = 'none';
      sound.style.display = 'block';
      btnNext.style.display = 'none';
      btnUnknown.style.display = 'flex';
    } else {
      resultPopup.style.display = 'block';
    }
  };

  public reastartGame(): void {
    const resultPopup = document.querySelector('.result-popup') as HTMLElement;
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    resultPopup.style.display = 'none';
    questionContainer.style.display = 'none';
    rulesContainer.style.display = 'flex';
    this.state = this.gamesService.state;
    this.questions = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.wordNumber = 0;
    this.ngOnInit();
    this.clicked.emit();
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    const answerBtns = document.querySelectorAll('.answer-btn') as NodeListOf<HTMLElement>;
    if (event.key === '1') {
      this.chooseWord(answerBtns[0]);
    } else if (event.key === '2') {
      this.chooseWord(answerBtns[1]);
    } else if (event.key === '3') {
      this.chooseWord(answerBtns[2]);
    } else if (event.key === '4') {
      this.chooseWord(answerBtns[3]);
    } else if (event.key === '5') {
      this.chooseWord(answerBtns[4]);
    } else if (event.key === 'Enter') {
      this.nextQuestion();
    }
  }
}
