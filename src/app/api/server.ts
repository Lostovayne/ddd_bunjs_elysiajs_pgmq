import { CreateProduct } from "@/contexts/catalog/products/application/CreateProduct";
import { BunSqlProductRepository } from "@/contexts/catalog/products/infrastructure/BunSqlProductRepository";
import { PutProductController } from "@/contexts/catalog/products/infrastructure/http/PutProductController";
import { sql } from "bun";
import Elysia from "elysia";

// Inyeccion de dependencias
// Caso de Uso (Recibe el repositorio)
// Controlador (Recibe el caso de uso)
const productRepository = new BunSqlProductRepository(sql);
const createProductUseCase = new CreateProduct(productRepository);
const putProductController = new PutProductController(createProductUseCase);

const app = new Elysia()
  .get("/health", () => "OK")
  .put("/products/:id", putProductController.run)
  .listen(3000);

console.log(`🦊 Elysia está corriendo en ${app.server?.hostname}:${app.server?.port}`);
