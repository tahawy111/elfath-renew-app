import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginToSite } from "@/lib/actions";
import puppeteer from "puppeteer";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your_username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string };

        if (!username || !password) return null;

        try {
          const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });
          const page = await browser.newPage();

          const result = await loginToSite(page, username, password);

          if ((result as any).error) {
            console.log("Invalid login attempt:", result);
            await browser.close();
            return null;
          }

          // 🔹 Get Cookies after login
          const cookies = await page.cookies();
          await browser.close();

          return { id: username, name: username, username, cookies };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string; // 🔹 Ensure it's a string
        token.cookies = user.cookies as any[]; // 🔹 Ensure it's an array of cookies
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string; // 🔹 Explicitly cast
        session.user.cookies = token.cookies as any[]; // 🔹 Explicitly cast
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };




export const getAuthSession = () => getServerSession(authOptions);