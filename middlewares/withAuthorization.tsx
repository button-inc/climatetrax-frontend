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
    const isRouteGraphQL = pathname.indexOf("api/postgraph") > -1;
    const isRouteAuth =
      pathname.indexOf("/auth") > -1 || pathname.indexOf("/unauth") > -1;

    // 👇️ check calls to graphql
    if (isRouteGraphQL === true) {
      // 👀 dev only
      if (process.env.API_HOST == "http://localhost:3000/") {
        // 👉️ OK: route all postgraphile routes
        return NextResponse.next();
      }
    }

    // 👇️ check if authentication route
    if (isRouteAuth === true) {
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
      // 👇️ vars for user token details via next-auth getToken to decrypt jwt in request cookie
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const role = token?.role;

      if (token && role) {
        // 👉️ OK: authenticated and authorized role

        // 👇️ validate routes properties
        const routes = pathname.split("/");
        // 👇️ ensure routes with JUST a language param (ex: /en) are routed to user"s home page- based on user"s role
        if (routes.length - 1 === 1) {
          // 👉️ route to user role home
          return NextResponse.redirect(
            new URL(`/${lng}/${role}/home`, request.url)
          );
        }

        // 👇️ validate routes matches jwt authenticated user role property
        if (routes.includes(role.toString())) {
          // 👉️ OK: route request
          return next(request, _next);
        } else {
          // ⛔️  UNAUTH'D:
          return NextResponse.redirect(new URL(`/${lng}/unauth`, request.url));
        }
      } else {
        // ⛔️  UNAUTH'D: redirect to signin
        return NextResponse.redirect(
          new URL(`/${lng}/auth/signin`, request.url)
        );
      }
    }
  };
};
