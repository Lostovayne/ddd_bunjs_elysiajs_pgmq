import { SQL } from "bun";
import type { ProductRepository } from "../domain/ProductRepository";
import { Product } from "../domain/Product";
import { Price } from "../domain/Price";

export class BunSqlProductRepository implements ProductRepository {
  constructor(private readonly db: SQL) {}

  async save(product: Product): Promise<void> {
    const data = product.toPrimitives();

    // Bun SQL usa template literals para prevenir inyección SQL automáticamente.
    // Es asíncrono, así que usa await.
    await this.db`
      INSERT INTO products (id, name, price_amount, price_currency, stock)
      VALUES (${data.id}, ${data.name}, ${data.priceAmount}, ${data.priceCurrency}, ${data.stock})
      ON CONFLICT (id) DO UPDATE SET
        name = ${data.name},
        price_amount = ${data.priceAmount},
        price_currency = ${data.priceCurrency},
        stock = ${data.stock}
    `;
  }

  async search(id: string): Promise<Product | null> {
    // Bun devuelve un array de resultados
    const result = await this.db`
      SELECT id, name, price_amount, price_currency, stock
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    if (result.length === 0) return null;

    // Bun SQL devuelve los resultados como objetos planos, pero cuidado con los tipos.
    // Postgres devuelve BigInt para números grandes, Bun suele manejarlos bien,
    // pero siempre es bueno asegurarse de castear si es necesario.
    const row = result[0];

    return Product.fromPrimitives({
      id: row.id,
      name: row.name,
      amount: Number(row.price_amount), // Aseguramos que sea number (cuidado con perder precisión si son trillones)
      currency: row.price_currency,
      stock: Number(row.stock),
    });
  }
}
