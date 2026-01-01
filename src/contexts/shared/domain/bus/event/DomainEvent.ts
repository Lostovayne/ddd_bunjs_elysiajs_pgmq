import { v4 as uuid } from "uuid";

export abstract class DomainEvent {
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(eventName: string, aggregateId: string, eventId?: string, occurredOn?: Date) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || uuid();
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
  }

  abstract toPrimitives(): Object;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(params: any): DomainEvent;
  new (...args: any[]): DomainEvent;
};
