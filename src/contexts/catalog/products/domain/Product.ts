import { Price } from "./Price";

export class Product {
  // Constructor privado. Control absoluto.
  private constructor(
    private readonly id: string,
    private name: string,
    private price: Price,
    private stock: number,
  ) {}

  // Factory Method
  static create(
    id: string,
    name: string,
    price: Price,
    stock: number,
  ): Product {
    if (name.length < 3) throw new Error("El nombre es ridículamente corto.");
    return new Product(id, name, price, stock);
  }

  // Método de negocio: Reducir stock al comprar
  reduceStock(quantity: number): void {
    if (this.stock - quantity < 0) {
      throw new Error("No hay stock suficiente. ¿Vendes aire?");
    }
    this.stock -= quantity;
    // Aquí lanzarías un evento de dominio: ProductStockReduced
  }

  // Getters para persistencia (y solo para eso)
  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      priceAmount: this.price.getAmount(),
      priceCurrency: this.price.getCurrency(),
      stock: this.stock,
    };
  }

  // Reconstituir desde la base de datos (Hydration)
  static fromPrimitives(data: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    stock: number;
  }): Product {
    return new Product(
      data.id,
      data.name,
      new Price(data.amount, data.currency),
      data.stock,
    );
  }
}
