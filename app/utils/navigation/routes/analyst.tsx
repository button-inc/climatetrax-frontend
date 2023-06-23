// 👇️ role based links displayed on the home page
import { RouteItem } from "@/types/declarations";

export const routes: RouteItem[] = [
  {
    button: "home.routes.dataset.button",
    content: "home.routes.dataset.content",
    href: "dataset/available",
    title: "home.routes.dataset.title",
  },
  {
    button: "home.routes.imported.button",
    content: "home.routes.imported.content",
    href: "imported",
    title: "home.routes.imported.title",
  },
  {
    button: "home.routes.anonymized.button",
    content: "home.routes.anonymized.content",
    href: "anonymized",
    title: "home.routes.anonymized.title",
  },
  {
    button: "home.routes.insight.button",
    content: "home.routes.insight.content",
    href: "insight",
    title: "home.routes.insight.title",
  },
  {
    button: "home.routes.analytic.button",
    content: "home.routes.analytic.content",
    href: "analytic",
    title: "home.routes.analytic.title",
  },
];
