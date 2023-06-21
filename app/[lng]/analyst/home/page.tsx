import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Home = dynamic(() => import("@/app/components/routes/Home"), {
  ssr: false,
});

export default async function Page() {
  return (
    <>
      <Home />
    </>
  );
}
