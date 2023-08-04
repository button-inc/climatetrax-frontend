import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import { request, gql } from "graphql-request";

async function getUserRole(email: string | null | undefined) {
  const endpoint = process.env.API_HOST + "api/auth/role";
  const query =
    gql`
    {
      permissions(condition: { email: "` +
    email +
    `" })  {
        nodes {
          userrole
        }
      }
    }`;
  const data: any = await request(endpoint, query);
  return data[Object.keys(data)[0]].nodes[0].userrole as any[];
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "@/auth",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (!token.role) {
        // 👇️ add role to the token from our permissions table
        const role = await getUserRole(token.email);
        if (role) {
          // 👉️ OK: set JWT role from our user record
          token.role = role;
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    // 👇️ called whenever a JSON Web Token is created - we can add to the JWT in this callback
    async jwt({ token }) {
      if (!token.role) {
        // 👇️ add role to the token from our permissions table
        const role = await getUserRole(token.email);
        if (role) {
          // 👉️ OK: set JWT role from our user record
          token.role = role;
        }
      }
      return token;
    },
  },
};
