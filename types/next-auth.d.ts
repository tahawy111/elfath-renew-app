import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      cookies?: any[];
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    cookies?: any[];
  }
}
