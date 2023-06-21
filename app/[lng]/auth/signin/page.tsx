"use client";
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useTranslation } from "@/i18n/client";

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

  // 👇️ render the providers as login buttons
  const callbackUrl =
    process.env.NEXTAUTH_CALLBACK_URL || "http://localhost:3000/";

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

  return <div>{content}</div>;
}
