import ImportedArea from "@/components/routes/imported/id/Area";

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
      <ImportedArea id={params.id}></ImportedArea>
    </>
  );
}
