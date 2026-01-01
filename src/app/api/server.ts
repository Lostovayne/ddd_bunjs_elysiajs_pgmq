import { BunSqlFactory } from "@/contexts/shared/infrastructure/persistence/bun-sql/BunSqlFactory";
import { Elysia } from "elysia";

// Imports Command (Escritura)
import { CreateProduct } from "@/contexts/catalog/products/application/CreateProduct";
import { BunSqlProductRepository } from "@/contexts/catalog/products/infrastructure/BunSqlProductRepository";
import { PutProductController } from "@/contexts/catalog/products/infrastructure/http/PutProductController";
import { PostgresEventBus } from "@/contexts/shared/infrastructure/bus/event/PostgresEventBus";

// Imports Worker & Proyección
import { DomainEventWorker } from "@/app/worker/DomainEventWorker";
import { ProjectProductOnCreate } from "@/contexts/catalog/products/application/ProjectProductOnCreate";

// Imports Query (Lectura)
import { BunSqlProductViewRepository } from "@/contexts/catalog/products/infrastructure/BunSqlProductViewRepository";
import { GetProductController } from "@/contexts/catalog/products/infrastructure/http/GetProductController";

// 1. Conexión
const dbConnection = BunSqlFactory.createClient();

// 2. Setup Command (Escritura)
const productRepository = new BunSqlProductRepository(dbConnection);
const eventBus = new PostgresEventBus(dbConnection);
const createProductUseCase = new CreateProduct(productRepository, eventBus);
const putProductController = new PutProductController(createProductUseCase);

// 3. Setup Worker (Procesamiento Segundo Plano)
const worker = new DomainEventWorker(dbConnection);
const projectProductOnCreate = new ProjectProductOnCreate(dbConnection);

worker.addSubscribers([projectProductOnCreate]); // Registramos la proyección
worker.start(); // ¡ENCENDEMOS MOTORES!

// 4. Setup Query (Lectura)
const viewRepository = new BunSqlProductViewRepository(dbConnection);
const getProductController = new GetProductController(viewRepository);

// 5. App HTTP
const app = new Elysia()
  .put("/products/:id", putProductController.run)
  .get("/products/:id", getProductController.run)
  .listen(3000);

console.log("🦊 Sistema CQRS completo corriendo en puerto 3000");
