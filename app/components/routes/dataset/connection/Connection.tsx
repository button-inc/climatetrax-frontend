import { Suspense } from "react";
import { gql } from "graphql-request";
import Spinner from "@/components/common/Spinner";
import DataSetQuery from "@/components/routes/dataset/connection/Query";
import { columnsDatasetConnection } from "@/utils/table/columns";
import { crumbsDatasetConnection } from "@/utils/navigation/crumbs";
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

export default async function Page({ endpoint }: GraphqlEndPoint) {
  // 👉️ RETURN: table with query data
  return (
    <>
      <Tag
        tag={"dataset.connection.tag"}
        crumbs={crumbsDatasetConnection}
      ></Tag>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Async Server Component */}
        <DataSetQuery
          endpoint={endpoint}
          query={query}
          columns={columnsDatasetConnection}
        ></DataSetQuery>
      </Suspense>
    </>
  );
}
