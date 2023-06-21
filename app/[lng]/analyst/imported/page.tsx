import Imported from "@/components/routes/imported/Imported";

export default function Page() {
  // 👇️ graphQL query endpoint for this role
  const endpoint = "api/analyst/graphql";
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Imported endpoint={endpoint}></Imported>
    </>
  );
}
