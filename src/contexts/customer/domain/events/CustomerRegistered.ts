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

  toPrimitives(): Object {
    return {
      name: this.name,
      email: this.email,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: any;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, eventId, occurredOn } = params;
    return new CustomerRegistered(aggregateId, attributes.name, attributes.email, eventId, occurredOn);
  }
}
