import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  public answeredAmount: number = 0;
  private audioObj: HTMLAudioElement = new Audio();
  public questions: Array<QuestionAudioCall> = [];
  public answers: Word[] = [];
  public randomWordsArr: Array<Word> = [];
  public url: string = environment.apiUrl;
  public isCorrect: boolean = false;
  public totalAmount: number = this.questions.length;
  public answerBullets = new Array(this.totalAmount).fill('');
  public answerScore = new Array(this.totalAmount).fill('');
  public correctCount: number = 0;
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
        this.randomWordsArr = this.getRandomWord(this.questions[this.answeredAmount]);
        this.playSound(this.questions[this.answeredAmount].answer.audio);
      });
  }

  public chooseWord(item: HTMLElement): void {
    const answerContainer = document.querySelector('.answer-container') as HTMLElement;
    const sound = document.querySelector('.sound') as HTMLElement;
    const btnNext = document.querySelector('.btn-next') as HTMLElement;
    const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
    const circles = document.querySelectorAll('.circle') as NodeListOf<HTMLElement>;
    const resultRows = document.querySelectorAll('.result-row') as NodeListOf<HTMLElement>;
    answerContainer.style.display = 'flex';
    sound.style.display = 'none';
    btnNext.style.display = 'flex';
    btnUnknown.style.display = 'none';
    if (item.textContent !== this.questions[this.answeredAmount].answer.wordTranslate) {
      item.style.background = 'red';
      this.answerBullets[this.answeredAmount] = 'red';
      this.answerScore[this.answeredAmount] = 'red';
    } else {
      this.answerBullets[this.answeredAmount] = 'green';
      this.answerScore[this.answeredAmount] = 'green';
      this.isCorrect = true;
      item.style.background = 'green';
      this.correctCount++;
    }
    this.userProgressService.checkWord({answer: this.isCorrect, ...this.words[this.answeredAmount]}, 'audiocall');
    circles.forEach((circle: Element, index: number) => {
      const classCircle = this.answerBullets[index];
      if (classCircle) circle.classList.add(classCircle);
    });
    resultRows.forEach((resultRow: Element, index: number) => {
      const classResultRow = this.answerScore[index];
      if (classResultRow) resultRow.classList.add(classResultRow);
    });
  };

  public renderQuestion(num?: number): void {
    if (num) this.group = String(num);
    this.page = this.gamesService.setRandomPage();
    this.getWords();
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    const circles = document.querySelectorAll('.circle') as NodeListOf<HTMLElement>;
    const resultRow = document.querySelectorAll('.result-row') as NodeListOf<HTMLElement>;
    rulesContainer.style.display = 'none';
    questionContainer.style.display = 'flex';
    circles.forEach((item: Element, index: number) => {
      item.classList.add(`${this.answerBullets[index]}`);
    });
    resultRow.forEach((item: Element, index: number) => {
      item.classList.add(`${this.answerScore[index]}`);
    });
  }

  public startGame(): void {
    this.state = 'process';
    this.group = this.gamesService.group;
    this.page = this.gamesService.page;
    this.getWords();
  }

  public nextQuestion(): void {
    this.answers.push(this.questions[this.answeredAmount].answer);
    console.log(this.answers);
    this.answeredAmount += 1;
    const answerBtn = document.querySelectorAll('.answer-btn') as NodeListOf<HTMLElement>;
    const answerContainer = document.querySelector('.answer-container') as HTMLElement;
    const sound = document.querySelector('.sound') as HTMLElement;
    const btnNext = document.querySelector('.btn-next') as HTMLElement;
    const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
    const resultPopup = document.querySelector('.result-popup') as HTMLElement;
    if (this.answeredAmount < this.totalAmount) {
      this.renderQuestion();
      answerBtn.forEach((item: HTMLElement) => {
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
    this.answers = [];
    this.wordNumber = 0;
    this.ngOnInit();
    this.clicked.emit();
  }
}
