import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

import { MiddlewareFactory } from "./types";
import { fallbackLng } from "@/i18n/settings";
const cookieName = "i18next";

// 👇️ return request's response
export const withResponse: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // 👇️ get the localization language, set in 'withLocalization'
    let lng = request.cookies.get(cookieName)?.value;
    if (!lng) lng = fallbackLng;

    // 👇️ vars for route management
    const { pathname } = request.nextUrl;
    const isRouteAPI = pathname.indexOf("/api/") > -1;

    // 👇️ if not api call, add lng route if missing or invalid lng in request url
    if (!isRouteAPI) {
      const isValidPath =
        request.cookies.get("languagePrefix")?.value === lng ? true : false;
      if (request.nextUrl.pathname === "/" || !isValidPath) {
        return NextResponse.redirect(new URL(`/${lng}`, request.url));
      }
    }

    // 👇️ create response
    const response = NextResponse.next();

    // 🍪 cookies: set response cookie with value set in middleware 'withLocalization'- used in i18n libraries
    response.cookies.set(cookieName, lng);

    // ⚽ headers: set response header content language value set in middleware 'withLocalization'- used in i18n libraries
    response.headers.set("content-language", lng);

    return response;
  };
};
