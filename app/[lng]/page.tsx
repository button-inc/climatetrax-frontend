import { useTranslation } from "@/i18n";
import SignOutButton from "@/components/auth/SignOut";
export default async function Page() {
  // 👇️ language management
  const { i18n } = await useTranslation();
  return (
    <>
      <h1>{i18n.t("hi")}</h1>
      <p> {i18n.t("msg")}</p>

      <SignOutButton buttonText={i18n.t("auth.signout")} />
    </>
  );
}
