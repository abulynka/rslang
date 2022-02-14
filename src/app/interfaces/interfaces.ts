export interface Env {
  production: boolean;
  apiUrl: string;
}

export interface UserInfo {
  email: string;
  password: string;
}

export interface User extends UserInfo {
  name: string;
}

export interface Auth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface Word {
  _id?: string;
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  difficult: boolean;
  userWord?: UserWord;
}

export interface Question {
  wrongTranslate: string;
  isTrue: boolean;
  wordData: Word;
}

export interface Answer extends Word {
  [key: string]: string | boolean | number | UserWord | undefined;
  answer: boolean;
}

export interface UserWordResult extends UserWord {
  id: string;
  wordId: string;
}

export interface UserWord {
  difficulty: string;
  optional: UserWordOptional;
}

export interface WordHistoryUnit {
  [key: string]: {
    isRight: boolean;
    gameName: string;
  };
}

export interface UserWordOptional {
  countOfAnswersInRow: number;
  isLearned: boolean;
  sprintHistory?: WordHistoryUnit;
  gameCallhistory?: WordHistoryUnit;
}

export interface QuestionAudioCall {
  answer: Word;
  other: Word[];
}

export interface AnimalSVG {
  src: string;
  alt: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface StatisticsOpt {
  sprintSeriesOfAnswers: number;
  audioSeriesOfAnswers: number;
}

export interface UserStatistics {
  id?: string;
  learnedWords: number;
  optional: StatisticsOpt;
}
