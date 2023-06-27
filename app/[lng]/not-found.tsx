import { useTranslation } from "@/i18n";
export default async function NotFound() {
  // 👇️ language management
  const { i18n } = await useTranslation();
  return (
    <>
      <p> {i18n.t("messages.errors.notfound")}</p>
    </>
  );
}
