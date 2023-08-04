import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Analytic = dynamic(() => import("@/app/components/routes/Analytic"), {
  ssr: false,
});
export default function Page() {
  return (
    <>
      <Analytic />
    </>
  );
}
