import { AggregateRoot } from "@/contexts/shared/domain/AggregateRoot";
import type { Email } from "@/contexts/shared/domain/value-object/Email";
import type { Name } from "@/contexts/shared/domain/value-object/Name";
import { CustomerId } from "./CustomerId";
import { CustomerRegistered } from "./events/CustomerRegistered";

export class Customer extends AggregateRoot {
  private constructor(
    public readonly id: CustomerId,
    public readonly name: Name,
    public readonly email: Email
  ) {
    super();
  }

  static register(id: CustomerId, name: Name, email: Email): Customer {
    const customer = new Customer(id, name, email);
    customer.record(new CustomerRegistered(id.value, name.value, email.value));

    return customer;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name,
      email: this.email.value,
    };
  }
}
