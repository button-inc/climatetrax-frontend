// 👇️ role based links displayed on the header hamburger
import { MenuItem } from "@/types/declarations";
// 👇️ extract the base URL from the current URL
const currentUrl = window.location.href;
const regex = /\/[a-z]{2}\/[a-z]+\//; // Regular expression to match language/role pattern
const matchedBaseUrl = currentUrl.match(regex);

const baseUrl = matchedBaseUrl ? matchedBaseUrl[0] : "";

export const menu: MenuItem[] = [
  {
    href: `${baseUrl}home`,
    button: "home.routes.home.button",
  },
  {
    href: `${baseUrl}dataset/available`,
    button: "home.routes.dataset.button",
  },
  {
    href: `${baseUrl}imported`,
    button: "home.routes.imported.button",
  },
  {
    href: `${baseUrl}anonymized`,
    button: "home.routes.anonymized.button",
  },
  {
    href: `${baseUrl}insight`,
    button: "home.routes.insight.button",
  },
  {
    href: `${baseUrl}analytic`,
    button: "home.routes.analytic.button",
  },
];
