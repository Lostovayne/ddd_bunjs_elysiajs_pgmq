import type { Context } from "elysia";
import type { CreateProduct } from "../../application/CreateProduct";

export class PutProductController {
  constructor(private readonly createProductUseCase: CreateProduct) {}

  run = async ({ body, params, set }: Context) => {
    const { name, priceAmount, priceCurrency, stock } = body as any;
    const { id } = params;

    if (!id) {
      set.status = 400;
      return { error: "Product ID is required" };
    }

    try {
      await this.createProductUseCase.execute(
        id,
        name,
        priceAmount,
        priceCurrency,
        stock
      );

      set.status = 201;
      return { message: "Product created successfully" };
    } catch (error) {
      set.status = 400;

      if (error instanceof Error) {
        return { error: error.message };
      }

      set.status = 500;
      return { error: "Algo reventó en el servidor. Revisa los logs." };
    }
  };
}
