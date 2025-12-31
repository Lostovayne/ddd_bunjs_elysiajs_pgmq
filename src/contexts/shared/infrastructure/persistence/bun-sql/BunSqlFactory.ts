import { SQL } from "bun";

export class BunSqlFactory {
  private static instance: SQL;

  static createClient(): SQL {
    if (!BunSqlFactory.instance) {
      const url = process.env.DATABASE_URL;

      if (!url) {
        throw new Error(
          "¿Esperas que me conecte a la base de datos por telepatía? Define DATABASE_URL en tu .env",
        );
      }

      BunSqlFactory.instance = new SQL(url);

      console.log("🔌 Conexión a Postgres establecida con Bun SQL nativo.");
    }

    return BunSqlFactory.instance;
  }
}
