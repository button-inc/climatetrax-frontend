import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions } from "./settings";

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...(getOptions() as object),
    lng: undefined, // detect the language on client side
    detection: {
      order: ["path", "cookie", "htmlTag", "navigator"],
      caches: ["cookie"],
    },
    react: {
      useSuspense: false,
    },
  });

export function useTranslation(ns: string | string[]) {
  return useTranslationOrg(ns);
}
