export interface Deserializable {
  deserialize(input: { [key: string | number]: string | number }): this;
}
