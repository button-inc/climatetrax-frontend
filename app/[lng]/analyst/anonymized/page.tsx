import Anonymized from "@/components/routes/anonymized/Anonymized";

export default function Page() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Anonymized></Anonymized>
    </>
  );
}
