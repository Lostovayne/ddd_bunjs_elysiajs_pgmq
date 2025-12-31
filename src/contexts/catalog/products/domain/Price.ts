export class Price {
  // Guardamos el dinero en centavos (int) para evitar problemas de float.
  // 10.99 USD -> 1099 cents
  constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (amount < 0) {
      throw new Error(
        "¿Vas a pagarle al cliente para que se lleve el producto? El precio no puede ser negativo.",
      );
    }
    if (currency.length !== 3) {
      throw new Error(
        "Usa el código ISO de moneda (USD, EUR, CLP), no inventes.",
      );
    }
  }

  static create(amount: number, currency: string): Price {
    return new Price(amount, currency);
  }

  getAmount(): number {
    return this.amount;
  }
  getCurrency(): string {
    return this.currency;
  }
}
