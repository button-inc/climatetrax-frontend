import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from "next-auth/providers/keycloak";

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
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: ((process.env.KEYCLOAK_AUTH_URL as string) +
        process.env.KEYCLOAK_AUTH_REALM) as string,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      let rolesKeycloak;
      if (token?.access_token) {
        //👇️by utilizing the jwt object provided by NextAuth, you can achieve the desired functionality without importing the jsonwebtoken package
        const data = token.jwt as {
          azp: string;
          resource_access: Record<string, { roles?: string[] }>;
        };
        const authorizedParty = data.azp;
        rolesKeycloak = data.resource_access[authorizedParty]?.roles;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: "analyst", //token.role, 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: "analyst", //u.role, 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨
        };
      }
      return token;
    },
  },
};
