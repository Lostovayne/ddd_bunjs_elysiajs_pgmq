import { v4 as uuid, validate } from "uuid";

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new Error(`<${this.constructor.name}> no recibe un UUID válido: ${id}`);
    }
  }

  toString(): string {
    return this.value;
  }
}
