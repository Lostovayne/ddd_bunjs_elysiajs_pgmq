import type { DomainEvent, DomainEventClass } from "@/contexts/shared/domain/bus/event/DomainEvent";
import type { DomainEventSubscriber } from "@/contexts/shared/domain/bus/event/EventBus";
import { SQL } from "bun";

export class DomainEventWorker {
  // Mapa de: NombreEvento -> Array de Suscriptores
  private subscribers: Map<string, Array<DomainEventSubscriber<DomainEvent>>> = new Map();
  private isRunning = false;

  constructor(private readonly db: SQL) {}

  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((eventClass: DomainEventClass) => {
        const eventName = eventClass.EVENT_NAME;
        const currentHandlers = this.subscribers.get(eventName) || [];
        currentHandlers.push(subscriber);
        this.subscribers.set(eventName, currentHandlers);
      });
    });
  }

  async start() {
    this.isRunning = true;
    console.log("👷 Worker iniciado. Esperando eventos...");

    while (this.isRunning) {
      try {
        await this.processPendingEvents();
      } catch (error) {
        console.error("🔥 Error crítico en worker:", error);
      }
      // Polling cada 5 segundos para reducir carga en BD
      // (en producción usa LISTEN/NOTIFY de Postgres para ser más eficiente)
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  private async processPendingEvents() {
    const events = await this.db`
      SELECT * FROM domain_events 
      WHERE processed_at IS NULL 
      ORDER BY occurred_on ASC 
      LIMIT 10
      FOR UPDATE SKIP LOCKED
    `;

    // Si no hay eventos, salimos rápido. Ahorra CPU.
    if (!events.length) return;

    for (const row of events) {
      const eventName = row.type;
      // ¡PARSEA EL PUTO JSON! El campo body es JSONB y viene como string
      const attributes = typeof row.body === "string" ? JSON.parse(row.body) : row.body;
      const { id: eventId, aggregate_id: aggregateId, occurred_on: occurredOn } = row;

      const handlers = this.subscribers.get(eventName);

      // Verificamos si hay handlers
      if (handlers && handlers.length > 0) {
        const subscriber = handlers[0];
        if (!subscriber) continue;

        // Buscamos la clase del evento
        const EventClass = subscriber.subscribedTo().find((cls) => cls.EVENT_NAME === eventName);

        if (EventClass) {
          // Ahora EventClass.fromPrimitives existe seguro (si arreglaste el tipo arriba)
          const domainEvent = EventClass.fromPrimitives({
            aggregateId,
            attributes,
            eventId,
            occurredOn: new Date(occurredOn),
          });

          console.log(`👷 Procesando: ${eventName} (${eventId})`);

          // Ejecutamos handlers
          await Promise.all(handlers.map((h) => h.on(domainEvent)));
        }
      }

      // Marcar como procesado
      await this.db`UPDATE domain_events SET processed_at = NOW() WHERE id = ${eventId}`;
    }
  }
}
