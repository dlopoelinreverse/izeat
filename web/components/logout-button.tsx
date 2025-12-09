"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  return <Button onClick={() => signOut()}>Signout</Button>;
};
