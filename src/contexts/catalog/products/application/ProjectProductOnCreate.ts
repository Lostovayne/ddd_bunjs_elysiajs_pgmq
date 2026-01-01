import type { DomainEventClass } from "@/contexts/shared/domain/bus/event/DomainEvent";
import type { DomainEventSubscriber } from "@/contexts/shared/domain/bus/event/EventBus";
import { SQL } from "bun";
import { ProductCreated } from "../domain/events/ProductCreated";

export class ProjectProductOnCreate implements DomainEventSubscriber<ProductCreated> {
  constructor(private readonly db: SQL) {}

  subscribedTo(): Array<DomainEventClass> {
    return [ProductCreated];
  }
  async on(event: ProductCreated): Promise<void> {
    const { aggregateId, name, priceAmount, priceCurrency, stock } = event;

    // Lógica de presentación para la vista
    const displayPrice = `${(priceAmount / 100).toFixed(2)} ${priceCurrency}`;
    const isAvailable = stock > 0;
    const searchKeywords = `${name} ${priceCurrency}`.toLowerCase();

    console.log(`[CQRS] Proyectando producto ${name} en la vista...`);

    // Insertamos en la TABLA DE LECTURA (products_catalog_view)
    await this.db`
      INSERT INTO products_catalog_view (id, name, display_price, is_available, search_keywords)
      VALUES (${aggregateId}, ${name}, ${displayPrice}, ${isAvailable}, ${searchKeywords})
      ON CONFLICT (id) DO UPDATE SET
        name = ${name},
        display_price = ${displayPrice},
        is_available = ${isAvailable},
        search_keywords = ${searchKeywords}
    `;
  }
}
