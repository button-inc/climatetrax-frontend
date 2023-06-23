import { Suspense } from "react";
import { gql } from "graphql-request";
import Spinner from "@/components/common/Spinner";
import DataTableQuery from "@/components/query/DataTableQuery";
import { columnsImportedArea } from "@/utils/table/columns";
import { crumbsImportedArea } from "@/utils/navigation/crumbs";
import { GraphqlParamEndPoint } from "@/types/declarations";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
// 👇️ used to changes options for @/components/table/DataTable
const cntx = "dlpAnalysis";
export default async function Page({ id, endpoint }: GraphqlParamEndPoint) {
  // 👇️ graphQL query
  const query = gql`
  {
    dlpTableColumns(filter: { jobId: { equalTo: "${id}" } }) {
      nodes {
        columnAnalysis {
          columnTitle
          identifiedInfoType
          maxLikelihood
          toAnonymize
          quotes
        }
        jobId
      }
    }
  }
`;

  // 👉️ RETURN: table with query data
  return (
    <>
      <Tag tag={"imported.dataset.tag"} crumbs={crumbsImportedArea}></Tag>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Async Server Component */}
        <DataTableQuery
          endpoint={endpoint}
          query={query}
          columns={columnsImportedArea}
          cntx={cntx}
        ></DataTableQuery>
      </Suspense>
    </>
  );
}
