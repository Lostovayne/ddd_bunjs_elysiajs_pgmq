import { AggregateRoot } from "@/contexts/shared/domain/AggregateRoot";
import { ProductCreated } from "./events/ProductCreated";
import { ProductStockReduced } from "./events/ProductStockReduced";
import { Price } from "./Price";

export class Product extends AggregateRoot {
  private id: string;
  private name: string;
  private price: Price;
  private stock: number;

  private constructor(id: string, name: string, price: Price, stock: number) {
    super();
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  static create(id: string, name: string, price: Price, stock: number): Product {
    const product = new Product(id, name, price, stock);
    // Evento de creación
    product.record(new ProductCreated(id, name, price.getAmount(), price.getCurrency(), stock));
    return product;
  }

  public reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("¿Quieres reducir una cantidad negativa? Eso es aumentar, genio.");
    }

    if (this.stock - quantity < 0) {
      throw new Error(`Stock insuficiente. Tienes ${this.stock}, piden ${quantity}.`);
    }

    this.stock -= quantity;

    // Registramos el evento de cambio
    this.record(new ProductStockReduced(this.id, quantity, this.stock));
  }

  public changePrice(newPrice: Price): void {
    this.price = newPrice;
    // Aquí iría un ProductPriceChanged...
  }

  // --- GETTERS (Solo lectura para quien lo necesite) ---
  // O mejor aún, usa solo toPrimitives() para sacar datos y no expongas getters individuales si no es necesario.

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      priceAmount: this.price.getAmount(),
      priceCurrency: this.price.getCurrency(),
      stock: this.stock,
    };
  }

  // Hidratación desde BD (Sin lanzar eventos)
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
      Price.create(data.amount, data.currency), // Usamos el factory de Price
      data.stock
    );
  }
}
