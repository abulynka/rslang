import { Deserializable } from './deserializable.model';

export class Word implements Deserializable {
  public id: string = '';
  public group: number = 0;
  public page: number = 0;
  public word: string = '';
  public image: string = '';
  public audio: string = '';
  public audioMeaning: string = '';
  public audioExample: string = '';
  public textMeaning: string = '';
  public textExample: string = '';
  public transcription: string = '';
  public wordTranslate: string = '';
  public textMeaningTranslate: string = '';
  public textExampleTranslate: string = '';

  public deserialize(input: { [key: string | number]: string | number }): this {
    Object.assign(this, input);
    return this;
  }
}
