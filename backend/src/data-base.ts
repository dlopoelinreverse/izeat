import { DataSource } from "typeorm";
import User from "./entities/user.entity";
import Session from "./entities/session.entity";
import Restaurant from "./entities/restaurant.entity";

import dotenv from "dotenv";
import Account from "./entities/account.entity";
dotenv.config();

const DataBase = new DataSource({
  type: "postgres",
  // host: process.env.DATABASE_HOST || "localhost",
  // port: parseInt(process.env.DATABASE_PORT || "0") || 5432,
  // username:
  //   process.env.DATABASE_USER || process.env.POSTGRES_USER || "postgres",
  // password: process.env.POSTGRES_PASSWORD || "postgres",
  // database: process.env.POSTGRES_DB || "test",
  url: process.env.DATABASE_URL,
  entities: [User, Session, Account, Restaurant],
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  schema: "public",
});

export default DataBase;
