import { Price } from "../domain/Price";
import { Product } from "../domain/Product";
import type { ProductRepository } from "../domain/ProductRepository";

export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}

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

    // 4. (Futuro) Publicación de Eventos
    // Aquí es donde haríamos:
    // const events = product.pullDomainEvents();
    // this.eventBus.publish(events);
    // Pero como todavía no has implementado el EventBus, lo dejamos pendiente.
  }
}
