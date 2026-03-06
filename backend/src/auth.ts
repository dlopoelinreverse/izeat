import Session from "./entities/session.entity";
import User from "./entities/user.entity";
import { ContextType } from "./types";

export async function authChecker({ context }: { context: ContextType }) {
  const { req } = context;

  const rawCookies = req.headers.cookie;
  let sessionToken: string | undefined;

  if (!rawCookies) {
    console.log("⚠️ No cookies received in request");
  } else {
    const match = rawCookies.match(
      /(?:__Secure-)?better-auth\.session_token=([^;]+)/,
    );
    if (match) {
      sessionToken = decodeURIComponent(match[1]).split(".")[0];
    } else {
      console.log(
        "⚠️ No session_token cookie found. Cookies:",
        rawCookies.substring(0, 200),
      );
    }
  }

  const session = await Session.findOne({
    where: { token: sessionToken },
    relations: ["user"],
  });

  if (!session) {
    console.log("❌ Session introuvable");
    return false;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    console.log("❌ Session expirée");
    return false;
  }

  const currentUser = await User.findOne({
    where: { id: session.userId },
  });

  if (!currentUser) {
    console.log("❌ Utilisateur non trouvé !");
    return false;
  }

  context.currentUser = currentUser;

  return true;
}
