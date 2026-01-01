import { DomainEvent } from "./bus/event/DomainEvent";

export abstract class AggregateRoot {
  private domainEvents: Array<DomainEvent>;

  constructor() {
    this.domainEvents = [];
  }

  // Devuelve los eventos y LIMPIA la lista (para no publicarlos dos veces)
  pullDomainEvents(): Array<DomainEvent> {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }

  // Método protegido para que solo la entidad pueda registrar sus propios eventos
  protected record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
