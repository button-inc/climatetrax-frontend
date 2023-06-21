import { Suspense } from "react";
import { gql } from "graphql-request";
import Spinner from "@/components/common/Spinner";
import DataTableQuery from "@/components/query/DataTableQuery";
import { columnsDatasetAvailable } from "@/utils/table/columns";
import { crumbsDatasetAvailable } from "@/utils/navigation/crumbs";
import { GraphqlEndPoint } from "@/types/declarations";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
// 👇️ graphQL query
const query = gql`
  {
    importRecords {
      nodes {
        jobId
        fileName
        submissionDate
        trackFormat {
          nickname
        }
        uploadedByUser {
          email
        }
      }
    }
  }
`;

// 🔥 workaround for error when trying to pass options as props with functions
// ❌ "functions cannot be passed directly to client components because they're not serializable"
// 👇️ used to changes options for @/components/table/DataTable
const cntx = "available";

export default async function Page({ endpoint }: GraphqlEndPoint) {
  // 👉️ RETURN: table with query data
  return (
    <>
      <Tag tag={"dataset.available.tag"} crumbs={crumbsDatasetAvailable}></Tag>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Async Server Component */}
        <DataTableQuery
          endpoint={endpoint}
          query={query}
          columns={columnsDatasetAvailable}
          cntx={cntx}
        ></DataTableQuery>
      </Suspense>
    </>
  );
}
