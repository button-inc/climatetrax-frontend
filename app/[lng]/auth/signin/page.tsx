import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const SignIn = dynamic(() => import("@/components/auth/SignIn"), {
  ssr: false,
});
export default function Page() {
  return (
    <>
      <SignIn />
    </>
  );
}
