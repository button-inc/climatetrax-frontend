import { createInstance, InitOptions } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions, languages, fallbackLng } from "./settings";
import { cookies, headers } from "next/headers";
import acceptLanguage from "accept-language";

const cookieName = "i18next";
// 👇️ Set the accepted languages (from i18n\settings) in the acceptLanguage instance
acceptLanguage.languages(languages);

// 👇️ create i18n instance and load locale resource json files
const initI18next = async (lng: string, ns?: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns) as InitOptions);
  return i18nInstance;
};

// 👇️ get lng set in middleware "withResponse" headers and cookies
export function detectLanguage(): string {
  const cookieStore = cookies();
  const headerStore = headers();

  let lng = acceptLanguage.get(headerStore?.get("content-language"));
  if (!lng && cookieStore?.has(cookieName)) {
    lng = cookieStore.get(cookieName)?.value ?? null;
  }
  if (!lng) lng = fallbackLng;

  return lng;
}

// 👇️ called from server side pages
export async function useTranslation(
  ns?: string,
  options: { keyPrefix?: string } = {}
) {
  const lng = detectLanguage();
  const i18nextInstance = await initI18next(lng, ns);

  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
