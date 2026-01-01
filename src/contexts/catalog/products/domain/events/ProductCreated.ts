import { DomainEvent } from "@/contexts/shared/domain/bus/event/DomainEvent";

export class ProductCreated extends DomainEvent {
  static readonly EVENT_NAME = "product.created";

  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly priceAmount: number,
    public readonly priceCurrency: string,
    public readonly stock: number,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(ProductCreated.EVENT_NAME, aggregateId, eventId, occurredOn);
  }

  toPrimitives(): Object {
    return {
      name: this.name,
      priceAmount: this.priceAmount,
      priceCurrency: this.priceCurrency,
      stock: this.stock,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: any;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, eventId, occurredOn } = params;
    return new ProductCreated(
      aggregateId,
      attributes.name,
      attributes.priceAmount,
      attributes.priceCurrency,
      attributes.stock,
      eventId,
      occurredOn
    );
  }
}
