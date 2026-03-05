import Session from "./entities/session.entity";
import User from "./entities/user.entity";
// import User from "./entities/user.entity";
import { ContextType } from "./types";
import { parse } from "cookie";

export async function authChecker({ context }: { context: ContextType }) {
  // const { req } = context;

  // const cookies = req.headers.cookie;
  // let sessionToken;

  // if (cookies) {
  //   const match = cookies.match(/better-auth\.session_token=([^;]+)/);
  //   if (match) {
  //     sessionToken = decodeURIComponent(match[1]).split(".")[0];
  //   }
  // }
  // const sessionData = await Session.findOne({
  //   where: { token: sessionToken },
  //   relations: ["user"],
  // });

  // if (!sessionData) {
  //   console.log("❌ Session non trouvée !");
  //   return false;
  // }

  // const now = Date.now();

  // if (sessionData.expiresAt.getTime() < now) {
  //   console.log("❌ Session expirée !");
  //   return false;
  // }

  // const currentUser = await User.findOne({
  //   where: { id: sessionData.userId },
  // });

  // if (!currentUser) {
  //   console.log("❌ Utilisateur non trouvé !");
  //   return false;
  // }

  // context.currentUser = currentUser;

  // return true;

  const { req } = context;

  const cookies = parse(req.headers.cookie ?? "");

  const sessionToken = cookies["better-auth.session_token"]?.split(".")[0];

  if (!sessionToken) {
    console.log("❌ Aucun session token");
    return false;
  }

  console.log("Session token reçu:", sessionToken);

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
