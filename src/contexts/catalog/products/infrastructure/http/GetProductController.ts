import type { Context } from "elysia";
import { BunSqlProductViewRepository } from "../BunSqlProductViewRepository";

export class GetProductController {
  constructor(private readonly repository: BunSqlProductViewRepository) {}

  run = async ({ params, set }: Context) => {
    if (!params.id) {
      set.status = 400;
      return { error: "ID es requerido" };
    }

    const product = await this.repository.search(params.id);
    if (!product) {
      set.status = 404;
      return { error: "No encontrado (o el worker aún no lo procesa)" };
    }
    return product;
  };
}
