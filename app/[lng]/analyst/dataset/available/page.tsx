import DatasetAvailable from "@/components/routes/dataset/Available";
export default function Page() {
  const endpoint = "api/analyst/graphql";

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <DatasetAvailable endpoint={endpoint}></DatasetAvailable>
    </>
  );
}
