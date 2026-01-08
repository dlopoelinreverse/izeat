import dotenv from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

dotenv.config({ path: join(__dirname, "../../.env") });

const DataBase = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  schema: "public",
});

export async function clearDB() {
  const runner = DataBase.createQueryRunner();
  await runner.query("SET session_replication_role = 'replica'");

  await Promise.all(
    DataBase.entityMetadatas.map(async (entity) =>
      runner.query(`ALTER TABLE "${entity.tableName}" DISABLE TRIGGER ALL`)
    )
  );
  await Promise.all(
    DataBase.entityMetadatas.map(async (entity) =>
      runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`)
    )
  );
  await runner.query("SET session_replication_role = 'origin'");
  await DataBase.synchronize();
}

export default DataBase;
