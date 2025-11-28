import { DataSource } from "typeorm";
// import env from "./env";
import User from "./entities/user.entity";
import Session from "./entities/session.entity";

const DataBase = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "0") || 5432,
  username:
    process.env.DATABASE_USER || process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "test",
  entities: [User, Session],
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
});

export default DataBase;
