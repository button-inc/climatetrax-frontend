"use client";
import { useTranslation } from "@/i18n/client";
export default async function Error() {
  // 👇️ language management
  const { t } = useTranslation("translation");
  return (
    <>
      <p> {t("messages.errors.error")}</p>
    </>
  );
}
