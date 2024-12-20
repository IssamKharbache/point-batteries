// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth";

// Extending the DefaultUser and DefaultSession types
declare module "next-auth" {
  // Extending User to include custom fields
  interface User {
    username: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
  }

  // Extending Session to include custom fields in user
  interface Session {
    user: User;
  }

  // Extending JWT to include custom fields
  interface JWT extends NextAuthJWT {
    username: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
  }
}
