import { BunSqlFactory } from "@/contexts/shared/infrastructure/persistence/bun-sql/BunSqlFactory";

async function runMigrations() {
  console.log("🏗️  Iniciando migraciones...");

  try {
    // 1. Conectamos
    const db = BunSqlFactory.createClient();

    // 2. Leemos el archivo SQL
    const schema = await Bun.file("src/app/database/schema.sql").text();

    // 3. Ejecutamos (Bun SQL permite ejecutar strings crudos con 'unsafe' para DDLs grandes)
    // Nota: db`...` es seguro, db.unsafe() ejecuta raw strings. Para scripts de init está bien.
    await db.unsafe(schema);

    console.log("✅ Tablas creadas correctamente");
    process.exit(0);
  } catch (error) {
    console.error("🔥 Error creando las tablas:", error);
    process.exit(1);
  }
}

runMigrations();
