import { Component, HostListener, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Word, Question, Answer } from 'src/app/interfaces/interfaces';
import { GamesStatesService } from 'src/app/services/games-states.service';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { WordsService } from 'src/app/services/words.service';
import { environment } from 'src/environments/environment';

function getQuestions(words: Word[]): Question[] {
  const questions: Question[] = [];

  function getIndex(size: number, i: number): number {
    const number: number = Math.round(Math.random() * size);
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
  public wordNumber: number = 0;
  public timer: number = 0;
  public score: number = 0;
  public rightNumbers: number = 0;
  public state: string = '';

  private group: string = '0';
  private page: string = '0';
  private audioObj: HTMLAudioElement = new Audio();

  public constructor(
    private wordsService: WordsService,
    private gameStateService: GamesStatesService,
    private userProgressService: UserProgressService
  ) {
    this.state = this.gameStateService.state;
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.checkWord(false);
    } else if (event.key === 'ArrowRight') {
      this.checkWord(true);
    }
  }

  public ngOnInit(): void {
    if (!this.gameStateService.isOpenedFormMenu) {
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
    this.audioObj.play();
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
    this.answers.push(wordAnswer);
    this.setRightAnswer(answer);
    this.nextWord();
  }

  public restartGame(): void {
    this.state = this.gameStateService.state;
    this.answers = [];
    this.questions = [];
    this.wordNumber = 0;
    this.score = 0;
    this.timer = 60;
    this.rightNumbers;
    this.ngOnInit();
  }

  private getWords(): void {
    this.wordsService
      .getWords(this.group, this.page)
      .pipe(
        map((data: any) => {
          return data as Word[];
        })
      )
      .subscribe((words: Word[]) => {
        this.questions = this.questions.concat(getQuestions(words));
        if (this.timer.toString() === '60') {
          this.setTimer();
        }
      });
  }

  private nextWord(): void {
    const preAmountOfWords: number = 5;
    this.wordNumber += 1;

    if (this.wordNumber === this.questions.length) {
      this.state = 'end';
      return;
    }
    // Если остается 4 слова и, то дополняем вопросами
    if (
      this.wordNumber === this.questions.length - preAmountOfWords &&
      this.page !== '0'
    ) {
      this.page = (parseInt(this.page) - 1).toString();
      this.getWords();
    }
  }

  private setRightAnswer(checkedAnswer: boolean): void {
    const rightNumbers: number = 3;
    const clearTime: number = 500;

    if (checkedAnswer) {
      this.rightNumbers += 1;
      this.score += 10;
    } else {
      this.rightNumbers = 0;
    }

    if (this.rightNumbers === rightNumbers) {
      this.score += 20;
      setTimeout(() => (this.rightNumbers = 0), clearTime);
    }
  }
}
