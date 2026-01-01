import { DomainEvent } from "@/contexts/shared/domain/bus/event/DomainEvent";

export class CustomerRegistered extends DomainEvent {
  static readonly EVENT_NAME = "customer.registered";

  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly email: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(CustomerRegistered.EVENT_NAME, aggregateId, eventId, occurredOn);
  }

  override toPrimitives(): Object {
    throw new Error("Method not implemented.");
  }
}
