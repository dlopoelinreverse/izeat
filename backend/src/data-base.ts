import { DataSource } from "typeorm";
import User from "./entities/user.entity";
import Session from "./entities/session.entity";
import Restaurant from "./entities/restaurant.entity";
import Account from "./entities/account.entity";
import Menu from "./entities/menu.entity";
import MenuItem from "./entities/menu-item.entity";
import MenuCategory from "./entities/menu-category.entity";
import RestaurantTable from "./entities/restaurant-table.entity";
import Ingredient from "./entities/ingredient";
import MenuItemIngredient from "./entities/menu-item-ingredient";

import dotenv from "dotenv";
dotenv.config();

const DataBase = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // entities: [
  //   User,
  //   Session,
  //   Account,
  //   Restaurant,
  //   Menu,
  //   MenuItem,
  //   MenuCategory,
  //   RestaurantTable,
  //   Ingredient,
  //   MenuItemIngredient,
  // ],
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: true,
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
