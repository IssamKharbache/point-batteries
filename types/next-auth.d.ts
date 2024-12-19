// types/next-auth.d.ts
import NextAuth from "next-auth";
import { Session } from "next-auth";

// Extending the session type
declare module "next-auth" {
  interface Session {
    user: {
      nom?: string | "";
      prenom?: string | "";
      email: string | "";
      role: string | "";
      username: string | "";
    };
  }
}
