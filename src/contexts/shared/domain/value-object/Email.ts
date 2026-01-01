export class Email {
  readonly value: string;

  constructor(value: string) {
    if (!value.includes("@")) throw new Error("Email inválido");
    this.value = value;
  }
}
