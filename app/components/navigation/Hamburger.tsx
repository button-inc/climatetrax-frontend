"use client";
import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/i18n/client";
import { Fragment, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { MenuItem } from "@/types/declarations";

export default function Hamburger() {
  // 👇️ language management, client side
  const { t } = useTranslation("translation");
  // 👇️ useSession hook from the next-auth/react library
  const { data: session } = useSession();
  // 👇️ menu management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [submenuVisible, setSubmenuVisible] = useState(false);

  // 👇️  code running on the client-side should be placed inside a useEffect hook with the appropriate condition to ensure it only runs in the browser
  useEffect(() => {
    // 👇️ role base menu items
    const fetchData = async () => {
      let constantsModule;

      switch (session?.user?.role) {
        case "analyst":
          constantsModule = await import("@/utils/navigation/patties/analyst");
          break;
        case "dropper":
          constantsModule = await import("@/utils/navigation/patties/dropper");
          break;
        case "manager":
          constantsModule = await import("@/utils/navigation/patties/manager");
          break;
        default:
          constantsModule = null; // Set a default value if none of the cases match
          break;
      }

      if (constantsModule) {
        const { menu: menuItems } = constantsModule as { menu: MenuItem[] };
        // 👇️ translations
        menuItems.forEach((item) => {
          item.button = t(item.button);
        });
        setMenuItems(menuItems);
      }
    };

    fetchData();

    /*👇️  include session?.user?.role in the dependency array to ensure the effect is re-run whenever the session?.user?.role value changes*/
  }, [session?.user?.role]);

  //👇️ language switcher
  const handleLanguageChange = (language: string) => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathnameParts = url.pathname.split("/");
    // 👇️ update the language part of the path
    pathnameParts[1] = language;
    url.pathname = pathnameParts.join("/");
    const newUrl = url.toString();
    window.history.pushState(null, "", newUrl);
    // 👇️ reload the page with ne language param
    window.location.reload();
  };

  //👇️ signout
  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <>
      <div className="ml-auto z-2000">
        <div className="flex items-center justify-center">
          <div className="relative inline-block text-left">
            <Menu>
              {({ open }) => (
                <>
                  <span className="rounded-md shadow-sm">
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-purple-800 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                      <div id="menuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Menu.Button>
                  </span>

                  <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    >
                      {session?.user && (
                        <div className="px-4 py-3">
                          <p className="text-sm leading-5">
                            {t("hamburger.signin")}
                          </p>
                          <p className="text-sm font-medium leading-5 text-gray-900 truncate">
                            {session.user.email} - {session.user.role}
                          </p>
                        </div>
                      )}
                      <div className="py-1">
                        {menuItems.map((item, key) => (
                          <Menu.Item key={key}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={`${
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                              >
                                {t(item.button)}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm flex items-center`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSubmenuVisible((prev) => !prev);
                              }}
                            >
                              {t("hamburger.language.menu")}
                            </button>
                          )}
                        </Menu.Item>
                        {submenuVisible && (
                          <Fragment>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleLanguageChange("en")}
                                  className={`${
                                    active
                                      ? "bg-violet-500 text-white"
                                      : "text-gray-900"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  {t("hamburger.language.en")}
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleLanguageChange("fr")}
                                  className={`${
                                    active
                                      ? "bg-violet-500 text-white"
                                      : "text-gray-900"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  {t("hamburger.language.fr")}
                                </button>
                              )}
                            </Menu.Item>
                          </Fragment>
                        )}
                      </div>
                      {session?.user && (
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                className={`${
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                onClick={handleSignOut}
                              >
                                {t("hamburger.signout")}
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      )}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          #menuToggle span {
            display: block;
            width: 33px;
            height: 4px;
            margin-bottom: 5px;
            position: relative;
            background: #cdcdcd;
            border-radius: 3px;
            z-index: 1;
            transform-origin: 4px 0px;
            transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
              background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
              opacity 0.55s ease;
          }
        `}
      </style>
    </>
  );
}
