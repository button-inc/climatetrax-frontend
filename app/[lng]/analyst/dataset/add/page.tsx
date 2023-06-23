import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Add = dynamic(() => import("@/components/routes/dataset/Add"), {
  ssr: false,
});

export default function Page() {
  return <Add endpoint="/api/analyst/upload"></Add>;
}
