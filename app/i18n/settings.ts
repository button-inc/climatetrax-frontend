export const fallbackLng = "en";
export const languages = [
  fallbackLng,
  "en-CA",
  "en-GB",
  "en-US",
  "fr",
  "fr-CA",
];
export const defaultNS = "translation";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
