import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  experimental: { joins: true },
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
  trustedOrigins: [process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL!],
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateOnAuth: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.AUTH_COOKIE_DOMAIN,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
