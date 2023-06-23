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
];
