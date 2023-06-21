"use client";
import { useTranslation } from "@/i18n/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { crumbsHome } from "@/utils/navigation/crumbs";
import { RouteItem } from "@/types/declarations";
import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});

export default function Page() {
  // 👇️ language management
  const { t } = useTranslation("translation");

  // 👇️ useSession hook from the next-auth/react library
  const { data: session } = useSession();
  const [routeItems, setRouteItems] = useState<RouteItem[]>([]);

  // 👇️  code running on the client-side should be placed inside a useEffect hook with the appropriate condition to ensure it only runs in the browser
  useEffect(() => {
    // 👇️ role base navigation tiles
    const fetchData = async () => {
      let constantsModule;

      switch (session?.user?.role) {
        case "analyst":
          constantsModule = await import("@/utils/navigation/routes/analyst");
          break;
        case "dropper":
          constantsModule = await import("@/utils/navigation/routes/dropper");
          break;
        case "manager":
          constantsModule = await import("@/utils/navigation/routes/manager");
          break;
        default:
          constantsModule = null; // Set a default value if none of the cases match
          break;
      }

      if (constantsModule) {
        const { routes: routeItems } = constantsModule as {
          routes: RouteItem[];
        };
        // 👇️ translations
        routeItems.forEach((item) => {
          item.button = t(item.button);
          item.content = t(item.content);
          item.title = t(item.title);
        });
        setRouteItems(routeItems);
      }
    };

    fetchData();

    /*👇️  include session?.user?.role in the dependency array to ensure the effect is re-run whenever the session?.user?.role value changes*/
  }, [session?.user?.role]);

  // 👇️ user's next-auth session info
  const name = session?.user?.name?.split(" ")[0] ?? "";
  //const tag = t("home.tag") + ", " + name + "!";

  // 👇️ create cards from routes
  return (
    <>
      <Tag tag={"home.tag"} crumbs={crumbsHome}></Tag>
      <div className="grid gap-14 lg:grid-cols-3">
        {routeItems.map((item, key) => (
          <div className="w-full rounded-lg shadow-md lg:max-w-sm" key={key}>
            <div className="p-4">
              <h4 className="text-xl text-purple-800">{item.title}</h4>
              <p className="mb-2 leading-normal">{item.content}</p>
              <button className="rounded-lg px-4 py-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-green-100 duration-300">
                <a href={item.href}>{item.button}</a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
