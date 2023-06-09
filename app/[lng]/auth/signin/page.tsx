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
  // 👇️ call to next-auth providers list
  useEffect(() => {
    const fetchData = async () => {
      const providers = await getProviders();
      setData(providers);
    };

    fetchData();
  }, []);

  // 👇️ render the providers as login buttons
  let callbackUrl = process.env.NEXTAUTH_CALLBACK_URL;
  if (typeof window !== 'undefined') {
    callbackUrl = callbackUrl || window.location.origin;
  }
  
  // Use the `callbackUrl` variable in your client-side code
  
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
