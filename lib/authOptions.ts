import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import { Role } from "@prisma/client";

interface Credentials {
  email: string;
  password: string;
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as Credentials;
        try {
          // Check if user credentials are Correct
          if (!email || !password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          const user = await db.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            throw { error: "Wrong credentials", status: 401 };
          }
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            throw {
              error: "Password Incorrect",
              status: 401,
              statusMessage: "Password Incorrect",
            };
          }
          // Return user object
          return {
            id: user.id,
            username: user.identifiant,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
            identifiant: user.identifiant,
          };
        } catch (_) {
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // Check if token contains user data
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          nom: token.nom as string,
          prenom: token.prenom as string,
          role: token.role as Role,
          identifiant: token.identifiant as string,
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Store user data in the JWT token
        token.id = user.id;
        token.username = user.username as string;
        token.email = user.email as string;
        token.nom = user.nom as string;
        token.prenom = user.prenom as string;
        token.role = user.role as Role;
        token.identifiant = user.identifiant as string;
      } else {
        // Refresh user data from the database
        const dbUser = await db.user.findUnique({
          where: { identifiant: token.identifiant as string | undefined },
        });
        token.id = dbUser?.id;
        token.username = dbUser?.identifiant;
        token.email = dbUser?.email;
        token.nom = dbUser?.nom;
        token.prenom = dbUser?.prenom;
        token.role = dbUser?.role;
        token.identifiant = dbUser?.identifiant;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/connecter",
    error: "/error",
  },
};
