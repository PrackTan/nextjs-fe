import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  InactiveAccountError,
  InvalidEmailPasswordError,
} from "./utils/errors";
import { sendRequest } from "./utils/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await sendRequest<IBackendRes<ILogin>>({
          url: "http://localhost:8000/api/v1/auth/login",
          method: "POST",
          body: {
            ...credentials,
          },
        });
        if (res.statusCode === 201) {
          return res.data?.user;
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError("Invalid credentials");
        } else if (+res.statusCode === 400) {
          throw new InactiveAccountError("Inactive account");
        } else {
          throw new Error("Internal server error");
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user as IUser;
      }
      return token;
    },
    session: async ({ session, token }) => {
      (session.user as IUser) = token.user as IUser;
      return session;
    },
  },
});
