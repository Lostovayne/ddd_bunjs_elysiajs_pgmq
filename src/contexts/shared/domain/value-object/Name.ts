export class Name {
  readonly value: string;

  constructor(value: string) {
    if (value.length < 3) throw new Error("Name is too short");
    this.value = value;
  }
}
