import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

//import { request, gql } from "graphql-request";

async function getUserRole(email: string | null | undefined) {
  /*
  const endpoint = process.env.API_HOST + "api/role";
  const query =
    gql`
    {
      permissions(condition: { email: "` +
    email +
    `" })  {
        nodes {
          email
          userrole
        }
      }
    }`;
  const data: any = await request(endpoint, query);
  return data[Object.keys(data)[0]].nodes as any[];
  */
  return "analyst"; // 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨
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
  ],
  callbacks: {
    async session({ session, token }) {
      // 👇️ add role to the token from our permissions table
      if (!token.role) {
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
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as any;
        // 👇️ add role to the token from our permissions table
        if (!u.role) {
          const role = await getUserRole(token.email);
          if (role) {
            // 👉️ OK: set JWT role from our user record
            token.role = role;
          }
        }
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
};
