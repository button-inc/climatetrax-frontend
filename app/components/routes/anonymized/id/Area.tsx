import { getSessionRoleEndpoint } from "@/utils/postgraphile/helpers";
import { Suspense } from "react";
import { gql } from "graphql-request";
import Spinner from "@/components/common/Spinner";
import DataTableQuery from "@/components/query/DataTableQuery";
import { columnsAnonymizedArea } from "@/utils/table/columns";
import { crumbsAnonymizedArea } from "@/utils/navigation/crumbs";
import { GraphqlParamEndPoint } from "@/types/declarations";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
export default async function Page({ id }: GraphqlParamEndPoint) {
  // 👇️ role base graphQL api route
  const endpoint = await getSessionRoleEndpoint();

  // 👇️ graphQL query
  const query =
    gql`
    {
      importRecords(condition: { jobId: ` +
    id +
    `}) {
        nodes {
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

  // 👉️ RETURN: table with query data
  return (
    <>
      <Tag tag={"anonymized.dataset.tag"} crumbs={crumbsAnonymizedArea}></Tag>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Async Server Component */}
        <DataTableQuery
          endpoint={endpoint}
          query={query}
          columns={columnsAnonymizedArea}
        ></DataTableQuery>
      </Suspense>
    </>
  );
}
