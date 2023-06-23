import { getQueryData } from "@/utils/helpers";
import { GraphqlQuery } from "@/types/declarations";
import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const DataTable = dynamic(() => import("@/components/table/DataTable"), {
  ssr: false,
});
export default async function Query({
  endpoint,
  query,
  columns,
  cntx,
}: GraphqlQuery) {
  // 👇️ data fetching, server side
  const data = await getQueryData(endpoint, query);

  // 👉️ OK: return table with dynamic data/columns
  return <DataTable rows={data} columns={columns} cntx={cntx} />;
}
