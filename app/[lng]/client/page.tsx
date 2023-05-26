"use client";
import { useTranslation } from "@/i18n/client";

export default function Page() {
  //❗Client Side Render translation, namespace "home"
  const { t } = useTranslation("home");

  return (
    <>
      <h1>{t("hi")}</h1>
      <p> {t("msg")}</p>
    </>
  );
}
