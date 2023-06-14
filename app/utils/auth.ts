import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt from 'jsonwebtoken';

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
      clientId: "ClimateTrax-Client",
      clientSecret: "KZ5zsX6vIEWBtNw2iPqCD9ZO4Jv4C2Y6",
      issuer: "http://localhost:8080/realms/ClimateTrax",
    }),
    
  ],
  callbacks: {
    session: ({ session, token }) => {
    let rolesKeycloak;
    if (token?.access_token) {
      const data = jwt.decode(token.access_token);
      const authorizedParty = data.azp;
      rolesKeycloak = data.resource_access[authorizedParty]?.roles;
    }

    return {
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
        rolesKeycloak: rolesKeycloak,
      },
    };
   },
    jwt: ({ token, user, account }) => {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      if (user) {
        const u = user as unknown as any;
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
