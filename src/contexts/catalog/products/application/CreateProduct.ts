import type { EventBus } from "@/contexts/shared/domain/bus/event/EventBus";
import { Price } from "../domain/Price";
import { Product } from "../domain/Product";
import type { ProductRepository } from "../domain/ProductRepository";

export class CreateProduct {
  constructor(
    private readonly repository: ProductRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(
    id: string,
    name: string,
    priceAmount: number,
    priceCurrency: string,
    stock: number
  ): Promise<void> {
    // Instanciamos los V0
    const price = Price.create(priceAmount, priceCurrency);
    const product = Product.create(id, name, price, stock);

    // Mi Persistencia
    await this.repository.save(product);

    await this.eventBus.publish(product.pullDomainEvents());
  }
}
