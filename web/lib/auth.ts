import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  experimental: { joins: true },
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
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
});
