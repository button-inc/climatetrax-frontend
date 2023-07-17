import { getQueryData } from "@/utils/postgraphile/helpers";
import ConnectionContainer from "@/components/routes/dataset/connection/Container";
import { GraphqlQuery } from "@/types/declarations";

// 👇️ async query for dataset\connection to return client-side container
export default async function Page({ endpoint, query, columns }: GraphqlQuery) {
  const data = await getQueryData(endpoint, query);
  // 👉️ OK: return connection container
  return <ConnectionContainer rows={data} columns={columns} />;
}
