import DatasetConnection from "@/components/routes/dataset/connection/Connection";

export default function Page() {
  const endpoint = "api/analyst/graphql";

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <DatasetConnection endpoint={endpoint}></DatasetConnection>
    </>
  );
}
