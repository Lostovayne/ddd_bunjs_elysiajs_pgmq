import { DomainEvent, type DomainEventClass } from "./DomainEvent";

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void;
}

// Un suscriptor es alguien que sabe escuchar una clase específica de evento
export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribedTo(): Array<DomainEventClass>; // Devuelve la CLASE del evento, ej: [ProductCreated]
  on(domainEvent: T): Promise<void>;
}
