import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./db";
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
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
        // Merge token data into the session object
        session.user = {
          ...session.user,
          username: token.username,
          email: token.email,
          nom: token.nom,
          prenom: token.prenom,
          role: token.role,
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Store user data in the JWT token
        token.username = user.username;
        token.email = user.email;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/connecter",
  },
};

export { authOptions };
