import { DomainEvent } from "@/contexts/shared/domain/bus/event/DomainEvent";

export class ProductStockReduced extends DomainEvent {
  static readonly EVENT_NAME = "product.stock_reduced";

  constructor(
    aggregateId: string,
    public readonly quantity: number,
    public readonly newStock: number,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(ProductStockReduced.EVENT_NAME, aggregateId, eventId, occurredOn);
  }

  toPrimitives(): Object {
    return {
      quantity: this.quantity,
      newStock: this.newStock,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: any;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, eventId, occurredOn } = params;
    return new ProductStockReduced(
      aggregateId,
      attributes.quantity,
      attributes.newStock,
      eventId,
      occurredOn
    );
  }
}
