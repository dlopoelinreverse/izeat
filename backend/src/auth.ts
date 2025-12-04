import Session from "./entities/session.entity";
import { ContextType } from "./types";

export async function authChecker({ context }: { context: ContextType }) {
  const { req } = context;

  const cookies = req.headers.cookie;
  let sessionToken;

  if (cookies) {
    const match = cookies.match(/better-auth\.session_token=([^;]+)/);
    if (match) {
      sessionToken = decodeURIComponent(match[1]).split(".")[0];
    }
  }
  const sessionData = await Session.findOne({
    where: { token: sessionToken },
    relations: ["user"],
  });

  if (!sessionData) {
    console.log("❌ Session non trouvée !");
    return false;
  }

  console.log("sessionUSerEmail ", sessionData.user.email);

  const now = Date.now();
  console.log("now", now);

  console.log("sessionData", sessionData.expiresAt.getTime());

  if (sessionData.expiresAt.getTime() < now) {
    console.log("❌ Session expirée !");
    return false;
  }

  console.log("🔍 Vérification session...");

  return true;
}
