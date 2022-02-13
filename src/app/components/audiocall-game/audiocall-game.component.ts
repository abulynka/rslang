import { Component, OnInit } from '@angular/core';
import { QuestionAudioCall, Word } from 'src/app/interfaces/interfaces';
import { GamesStatesService } from 'src/app/services/games-states.service';
import { WordsService } from 'src/app/services/words.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss']
})
export class AudiocallGameComponent {
  public words: Word[] = [];
  private groupNumber: number = 0;
  private pageNumber: number = 0;
  public wordNumber: number = 0;
  public answeredAmount: number = 0;
  private audioObj: HTMLAudioElement = new Audio();
  public questions: Array<QuestionAudioCall> = [];
  public randomWordsArr: Array<Word> = [];
  public url: string = environment.apiUrl;
  public isCorrect: boolean = false;
  public totalAmount: number = this.questions.length;

  public constructor(private wordsService: WordsService, private GamesService: GamesStatesService) { }

  // ngOnInit(): void {
  // }

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

  public renderQuestion(): void {
    const rulesContainer = document.querySelector('.rules-container') as HTMLElement;
    rulesContainer.remove();
    const questionContainer = document.querySelector('.question-container') as HTMLElement;
    questionContainer.style.display = 'flex';
    this.getWords();
    const answerBtns = document.querySelectorAll(".answer-btn") as NodeListOf<HTMLElement>;
    answerBtns.forEach((item: HTMLElement) => {
      item.addEventListener("click", () => this.chooseWord(item));
    })
  }

  private getWords(): void {
    this.wordsService
      .getWords(this.groupNumber.toString(), this.pageNumber.toString())
      .subscribe((words: Word[]) => {
        this.words = words;
        this.questions = new Array(20).fill(0).map((_, index) => {
          return {
            answer: this.words[this.groupNumber * this.pageNumber * 20 + index],
            other: new Array(4).fill(0).map(() => {
              return this.words[Math.floor(Math.random() * this.words.length)];
            }),
          };
        });
        this.randomWordsArr = this.getRandomWord(this.questions[this.answeredAmount]);
      });
  }

  public playSound(word: Word): void {
    this.audioObj.src = `${this.url}/${word.audio}`;
    this.audioObj.load();
    this.audioObj.play();
  }

  public chooseWord(item: HTMLElement): void {
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
    } else {
      this.isCorrect = true;
      item.style.background = "green";
    }
    this.answeredAmount++;
  };

  public nextQuestion() {
    if (this.answeredAmount < this.totalAmount) {
      this.renderQuestion();
    } else {
      const answerContainer = document.querySelector('.answer-container') as HTMLElement;
      const sound = document.querySelector('.sound') as HTMLElement;
      answerContainer.style.display = "none";
      sound.style.display = "block";
    }
  };
}
