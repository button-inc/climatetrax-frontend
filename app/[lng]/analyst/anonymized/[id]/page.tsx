import AnonymizedArea from "@/components/routes/anonymized/id/Area";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  // 👇️ graphQL query endpoint for this role
  const endpoint = "api/analyst/graphql";

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <AnonymizedArea id={params.id} endpoint={endpoint}></AnonymizedArea>
    </>
  );
}
