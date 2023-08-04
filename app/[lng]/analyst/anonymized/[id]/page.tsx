import AnonymizedArea from "@/components/routes/anonymized/id/Area";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <AnonymizedArea id={params.id}></AnonymizedArea>
    </>
  );
}
