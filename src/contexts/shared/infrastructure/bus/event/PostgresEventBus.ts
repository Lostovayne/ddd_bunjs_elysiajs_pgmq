import type { DomainEvent } from "@/contexts/shared/domain/bus/event/DomainEvent";
import type { DomainEventSubscriber, EventBus } from "@/contexts/shared/domain/bus/event/EventBus";
import type { SQL } from "bun";

export class PostgresEventBus implements EventBus {
  constructor(private readonly db: SQL) {}

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const primitives = event.toPrimitives();

      await this.db`
      INSERT INTO domain_events (id, aggregate_id, type, body, occurred_on)
      VALUES (
        ${event.eventId}, 
        ${event.aggregateId}, 
        ${event.eventName}, 
        ${JSON.stringify(primitives)}, 
        ${event.occurredOn}
      )
      `;
      console.log(`[EventBus] Evento guardado en BD: ${event.eventName}`);
    }
  }

  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void {
    // En esta implementación, los suscriptores los maneja el Worker, no este publicador.
    // Dejamos esto vacío por ahora para cumplir el contrato.
    throw new Error("Method not implemented.");
  }
}
