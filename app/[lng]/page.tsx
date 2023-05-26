import { useTranslation } from "@/i18n";
export default async function Page() {
  //❗Server Side Render translation, default namespace (translation)
  const { i18n } = await useTranslation();
  return (
    <>
      <h1>{i18n.t("hi")}</h1>
      <p> {i18n.t("msg")}</p>
    </>
  );
}
