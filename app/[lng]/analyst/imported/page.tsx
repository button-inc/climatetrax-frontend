import Imported from "@/components/routes/imported/Imported";

export default function Page() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Imported></Imported>
    </>
  );
}
