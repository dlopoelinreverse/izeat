import Session from "./entities/session.entity";
import User from "./entities/user.entity";
import { ContextType } from "./types";

export async function authChecker({ context }: { context: ContextType }) {
  //   roles: string[] = []
  const { req } = context;

  const session = await Session.findOneBy({
    token: req.cookies.session,
  });

  if (!session) {
    return false;
  }

  const user = await User.findOneBy({
    id: session.userId,
  });

  if (!user) {
    return false;
  }

  return true;
}
