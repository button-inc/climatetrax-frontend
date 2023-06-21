import Anonymized from "@/components/routes/anonymized/Anonymized";

export default function Page() {
  // 👇️ graphQL query endpoint for this role
  const endpoint = "api/analyst/graphql";
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Anonymized endpoint={endpoint}></Anonymized>
    </>
  );
}
