import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useTranslation } from "next-i18next";  //import from next-i18next instead of react-i18next prevents error "NextJS+NextI18Next hydration error when trying to map through array: "Text content does not match server-rendered HTML". This is because the response of serverSideTranslations is a custom object with _nextI18Next property.
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions } from "./settings";

// Create the i18n instance
const i18next = i18n.createInstance();

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
    lng: undefined, // detect the language on the client side
    detection: {
      order: ["path", "cookie", "htmlTag", "navigator"],
      caches: ["cookie"],
    },
    react: {
      useSuspense: false,
    },
  });

export { i18next, useTranslation };
