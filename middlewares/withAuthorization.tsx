//import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactory } from "./types";
import { parse } from "url";
import { getToken } from "next-auth/jwt";
import { fallbackLng } from "@/i18n/settings";
const cookieName = "i18next";

export const withAuthorization: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // 👇️ get the localization language, set in 'withLocalization'
    let lng = request.cookies.get(cookieName)?.value;
    if (!lng) lng = fallbackLng;

    // 👇️ vars for route management
    const { pathname } = request.nextUrl;
    const isRouteAPI = pathname.indexOf("/api/") > -1;
    const isRouteAuth = pathname.indexOf("/auth") > -1;

    // 👇️ check if authentication route
    if (isRouteAPI === true || isRouteAuth === true) {
      const { query } = parse(request.url, true);
      const { error } = query;
      // 👇️ check if authentication error
      if (error) {
        return NextResponse.redirect(
          new URL(`/${lng}/auth/error`, request.url)
        );
      }
      // 👉️ return response
      NextResponse.next();
    } else {
      // 👇️ vars for user session details via next-auth getToken to decrypt jwt in request cookie
      const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (session) {
        // 👉️ OK: authenticated and authorized\route to next middleware
        return next(request, _next);
      } else {
        // 👉️ UNAUTH'D: redirect to signin
        return NextResponse.redirect(
          new URL(`/${lng}/auth/signin`, request.url)
        );
      }
    }

    /*
    // 👇️ vars for user session details via next-auth getToken to decrypt jwt in request cookie
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 👇️ route management- gate access users only authenticated by oAuth and authorized by DB permissions table
    // 👉️  authenticated user"s jwt role property (set from DB permission table in api/auth/nextauth)
    const role = session?.role;
    if (!role) {
      // ⛔️ denied: request is not authorized - route to auth pathway

      // 👇️ vars for route management
      const { pathname } = request.nextUrl;
      const isRouteAuth = pathname.indexOf("auth") > -1;
      const isRouteAPI = pathname.indexOf("/api/") > -1;

      // 👇️ set outgoing response with `Set-Cookie` header
      let lng = request.cookies.get(cookieName).value;
      let response;
      if (isRouteAuth === true) {
        //👉️ allow calls to /auth for authentication
        response = NextResponse.next();
      } else {
        // 👇️ redirect to unauth or auth login
        let url;
        if (isRouteAPI === true) {
          url = "/api/auth/unauthorized";
        } else {
          url = `/${lng}/auth/signin`;
        }
        response = NextResponse.redirect(new URL(url, request.url));
      }
      // 👉️ route to auth pathway
      return response;
    } else {
      //👌 ok: route to next middleware
      return next(request, _next);
    }
    */
    //NextResponse.next();
    //return next(request, _next);
  };
};
