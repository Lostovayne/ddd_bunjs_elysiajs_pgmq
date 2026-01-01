import { DomainEvent } from "@/contexts/shared/domain/bus/event/DomainEvent";

export class ProductStockReduced extends DomainEvent {
  static readonly EVENT_NAME = "product.stock_reduced";

  constructor(
    aggregateId: string,
    public readonly amountReduced: number,
    public readonly newStockLevel: number
  ) {
    super(ProductStockReduced.EVENT_NAME, aggregateId);
  }

  toPrimitives(): Object {
    return {
      amountReduced: this.amountReduced,
      newStockLevel: this.newStockLevel,
    };
  }
}
