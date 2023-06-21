"use client";
import { useTranslation } from "@/i18n/client";

export default function Page() {
  // 👇️ client language management
  const { t } = useTranslation("translation");
  return (
    <>
      <h1>⛔️ {t("messages.unauth")}</h1>
    </>
  );
}
