import { v4 as uuid } from "uuid";

export abstract class DomainEvent {
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(
    eventName: string,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date,
  ) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || uuid();
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
  }

  // Método abstracto para que cada evento defina cómo convertirse a primitivos (útil para enviarlo a RabbitMQ/Kafka después)
  abstract toPrimitives(): Object;
}
