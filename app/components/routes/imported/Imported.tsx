import { getSessionRoleEndpoint } from "@/utils/postgraphile/helpers";
import { Suspense } from "react";
import { gql } from "graphql-request";
import Spinner from "@/components/common/Spinner";
import DataTableQuery from "@/components/query/DataTableQuery";
import { columnsImported } from "@/utils/table/columns";
import { crumbsImported } from "@/utils/navigation/crumbs";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});

// 🔥 workaround for error when trying to pass options as props with functions
// ❌ "functions cannot be passed directly to client components because they're not serializable"
// 👇️ used to change options for @/components/table/DataTable
const cntx = "imported";

export default async function Page() {
  // 👇️ role base graphQL api route
  const endpoint = await getSessionRoleEndpoint();

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
  // 👉️ RETURN: table with query data
  return (
    <>
      <Tag tag={"imported.datasets.tag"} crumbs={crumbsImported}></Tag>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Async Server Component */}
        <DataTableQuery
          endpoint={endpoint}
          query={query}
          columns={columnsImported}
          cntx={cntx}
        ></DataTableQuery>
      </Suspense>
    </>
  );
}
