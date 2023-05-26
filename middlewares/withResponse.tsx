import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

import { fallbackLng } from "@/i18n/settings";
import { MiddlewareFactory } from "./types";
const cookieName = "i18next";

// 👇️ return request's response
export const withResponse: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // 👇️ get the localization language, set in 'withLocalization'
    let lng = request.cookies.get(cookieName)?.value;
    if (!lng) lng = fallbackLng;

    // 👇️ add lng route if missing or invalid in request url
    const isValidPath =
      request.cookies.get("languagePrefix")?.value === lng ? true : false;
    if (request.nextUrl.pathname === "/" || !isValidPath) {
      return NextResponse.redirect(new URL(`/${lng}`, request.url));
    }

    // 👇️ create response
    const response = NextResponse.next();

    // 🍪 set response cookie with value set in middleware 'withLocalization'- used in i18n libraries
    response.cookies.set(cookieName, lng);

    // “⚽” set response header content language value set in middleware 'withLocalization'- used in i18n libraries
    response.headers.set("content-language", lng);

    return response;
  };
};
