import { Component, OnInit } from '@angular/core';
import { QuestionAudioCall, Word } from 'src/app/interfaces/interfaces';
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
  public randomWordsArr: Array<Word> = [];
  public url: string = environment.apiUrl;
  public isCorrect: boolean = false;
  public totalAmount: number = this.questions.length;
  public answerBullets = new Array(this.totalAmount).fill("");
  public answerScore = new Array(this.totalAmount).fill("");
  public correctCount: number = 0;

  public constructor(private wordsService: WordsService, private GamesService: GamesStatesService, private userProgressService: UserProgressService) { }

  public ngOnInit(): void {
    if (!this.GamesService.isOpenedFormMenu) {
      this.startGame();
    }
  }

  public playSound(word: Word): void {
    this.audioObj.src = `${this.url}/${word.audio}`;
    this.audioObj.load();
    this.audioObj.play();
  }

  public getRandomWord(question: QuestionAudioCall): Array<Word> {
    const shuffle = (array: Array<Word>) => {
      let currentIndex = array.length,
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
      .getWords(this.group, this.GamesService.page)
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
        this.playSound(this.questions[this.answeredAmount].answer);
      });
  }

  public chooseWord(item: HTMLElement): void {
    let currentIndex = this.answeredAmount;
    const answerContainer = document.querySelector('.answer-container') as HTMLElement;
    const sound = document.querySelector('.sound') as HTMLElement;
    const btnNext = document.querySelector('.btn-next') as HTMLElement;
    const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
    answerContainer.style.display = "flex";
    sound.style.display = "none";
    btnNext.style.display = "flex";
    btnUnknown.style.display = "none";
    const answerWord = document.querySelector(".answer-word") as HTMLElement;
    if (item.textContent !== answerWord.textContent) {
      item.style.background = "red";
      this.answerBullets[currentIndex] = "red";
      this.answerScore[currentIndex] = "red";
    } else {
      this.answerBullets[currentIndex] = "green";
      this.answerScore[currentIndex] = "green";
      this.isCorrect = true;
      item.style.background = "green";
      this.correctCount++;
    }
    this.userProgressService.checkWord({answer: this.isCorrect, ...this.words[this.answeredAmount]}, 'audiocall');
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle, index) => {
      const classCircle = this.answerBullets[index];
      if (classCircle) circle.classList.add(classCircle);
    });
    const resultRows = document.querySelectorAll('.result-row');
    resultRows.forEach((resultRow, index) => {
      const classResultRow = this.answerScore[index];
      if (classResultRow) resultRow.classList.add(classResultRow);
    });
  };

  public renderQuestion(num?: number): void {
    if (num) {
      this.group = String(num);
    };
    this.page = this.GamesService.setRandomPage();
    this.getWords();
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    rulesContainer.style.display = 'none';
    console.log()
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    questionContainer.style.display = 'flex';
    const circles = document.querySelectorAll('.circle');
    circles.forEach((item, index) => {
      item.classList.add(`${this.answerBullets[index]}`);
    });
    const resultRow = document.querySelectorAll('.result-row');
    resultRow.forEach((item, index) => {
      item.classList.add(`${this.answerScore[index]}`);
    });
  }

  public startGame(): void {
    this.state = 'process';
    this.group = this.GamesService.group;
    this.page = this.GamesService.page;
    this.getWords();
  }

  public nextQuestion() {
    this.answeredAmount += 1;
    if (this.answeredAmount < this.totalAmount) {
      this.renderQuestion();
      const answerBtn = document.querySelectorAll('.answer-btn') as NodeListOf<HTMLElement>;
      answerBtn.forEach((item: HTMLElement) => {
        item.style.background = '#0d6efd';
      })
      const answerContainer = document.querySelector('.answer-container') as HTMLElement;
      const sound = document.querySelector('.sound') as HTMLElement;
      answerContainer.style.display = "none";
      sound.style.display = "block";
      const btnNext = document.querySelector('.btn-next') as HTMLElement;
      const btnUnknown = document.querySelector('.btn-unknown') as HTMLElement;
      btnNext.style.display = "none";
      btnUnknown.style.display = "flex";
    } else {
      const resultPopup = document.querySelector('.result-popup') as HTMLElement;
      resultPopup.style.display = 'block';
    }
  };

  public closeResult() {
    const resultPopup = document.querySelector('.result-popup') as HTMLElement;
    resultPopup.style.display = "none";
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    questionContainer.style.display = "none";
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    rulesContainer.style.display = "flex";
  }

}
