"use client";
import { useTranslation } from "@/i18n/client";
import React, { useEffect, useState } from "react";
const NoSSR: React.FC<any> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : null;
};

export default async function Error() {
  // 👇️ language management
  const { t } = useTranslation("translation");
  return (
    <div>
      <NoSSR>
        {/* Code that should not be translated on the server side */};
        <p> {t("messages.errors.error")}</p>
      </NoSSR>
      {/* The rest of page content */}
    </div>
  );
}
