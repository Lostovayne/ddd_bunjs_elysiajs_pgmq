import { SQL } from "bun";

export class BunSqlProductViewRepository {
  constructor(private readonly db: SQL) {}

  async search(id: string) {
    const result = await this.db`
      SELECT id, name, display_price, is_available 
      FROM products_catalog_view 
      WHERE id = ${id}
      LIMIT 1
    `;
    return result[0] || null;
  }
}
