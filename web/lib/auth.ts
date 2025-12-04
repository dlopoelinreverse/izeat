import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  experimental: { joins: true },
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 10,
    updateOnAuth: true,
  },
});
