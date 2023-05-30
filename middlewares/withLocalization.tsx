import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "@/i18n/settings";
const cookieName = "i18next";
// 👇️ Set the accepted languages (from i18n\settings) in the acceptLanguage instance
acceptLanguage.languages(languages);

// 👇️ determine the locale/language to be used
export const withLocalization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // 1️⃣ Check (valid) Language Prefix in URL
    const { pathname } = request.nextUrl;
    //👇️ the first non-empty segment is considered the language prefix
    const [languagePrefix] = pathname.split("/").filter(Boolean);
    // 👇️ validate the language is supported from the accepted languages
    let lng = languagePrefix
      ? languagePrefix === acceptLanguage.get(languagePrefix)
        ? acceptLanguage.get(languagePrefix)
        : null
      : null;
    //  🍪  set a cookie property on the request object for withResponse routing validation
    request.cookies.set("languagePrefix", languagePrefix);

    //2️⃣ Check i18n Cookie for Language
    if (!lng) {
      const cookieStore = request.cookies;
      const cookieLng = cookieStore.get(cookieName)?.value;
      // Validate the language is supported from the accepted languages
      if (cookieLng && languages.includes(cookieLng)) {
        lng = acceptLanguage.get(cookieLng);
      }
    }

    //3️⃣ Check Accept-Language Header
    // 👇️ validate the language is supported from the accepted languages
    if (!lng) lng = acceptLanguage.get(request.headers.get("Accept-Language"));

    //4️⃣ Set Default Language from i18next Settings
    if (!lng) lng = fallbackLng;

    // 🍪 set a request i18next cookie to add to response in withResponse
    request.cookies.set(cookieName, lng);

    //👌 ok: route to next middleware
    return next(request, _next);
  };
};
