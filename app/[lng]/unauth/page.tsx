import { useTranslation } from "@/i18n";

export default async function Page() {
  // 👇️ language management
  const { i18n } = await useTranslation();
  return (
    <>
      <p> {i18n.t("messages.errors.unauth")}</p>
    </>
  );
}
