import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Insight = dynamic(() => import("@/app/components/routes/Insight"), {
  ssr: false,
});

export default async function Page() {
  return (
    <>
      <Insight />
    </>
  );
}
