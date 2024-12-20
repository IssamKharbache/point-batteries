import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { NextAuthOptions } from "next-auth";

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
            console.log("Not Inputs");
            throw { error: "No Inputs Found", status: 401 };
          }
          const user = await db.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            console.log("User not found");
            throw { error: "User not found", status: 401 };
          }
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            throw {
              error: "Password Incorrect",
              status: 401,
              statusMessage: "Password Incorrect",
            };
          }
          const userData = {
            id: user._id,
            username: user.identifiant,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
          };

          return userData;
        } catch (error) {
          console.log(error);
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
          username: token.username as string,
          email: token.email as string,
          nom: token.nom as string,
          prenom: token.prenom as string,
          role: token.role as string,
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Store user data in the JWT token
        token.username = user.username as string;
        token.email = user.email as string;
        token.nom = user.nom as string;
        token.prenom = user.prenom as string;
        token.role = user.role as string;
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
