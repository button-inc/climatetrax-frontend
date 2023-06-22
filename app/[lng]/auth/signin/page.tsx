"use client";
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useTranslation } from "@/i18n/client";
import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
export default function Page() {
  const { t } = useTranslation("translation");
  const [data, setData] = useState<Record<string, ClientSafeProvider> | null>(
    null
  );

  // 👇️  code running on the client-side should be placed inside a useEffect hook with the appropriate condition to ensure it only runs in the browser
  useEffect(() => {
    // 👇️ call to next-auth providers list
    const fetchData = async () => {
      const providers = await getProviders();
      setData(providers);
    };

    fetchData();
  }, []);

  // 👇️ render the providers as login buttons with the correct calback url
  let hostUrl;
  if (typeof window !== "undefined") {
    hostUrl = window.location.origin;
  }
  const callbackUrl =
    hostUrl === "http://localhost:4503"
      ? "http://localhost:3000/"
      : process.env.NEXTAUTH_URL;

  const content = data
    ? Object.values(data).map((provider: ClientSafeProvider) => (
        <div key={provider.id} className={styles.provider}>
          <button
            className={styles.button}
            onClick={() =>
              signIn(provider.id, {
                callbackUrl,
              })
            }
          >
            <img
              alt={provider.name}
              src={`https://authjs.dev/img/providers/${provider.id}.svg`}
            />
            <span>
              {t("auth.signin")} {provider.name}
            </span>
          </button>
        </div>
      ))
    : null;

  return (
    <>
      <Tag tag={"auth.tag"} crumbs={[]}></Tag>
      {content}
    </>
  );
}
