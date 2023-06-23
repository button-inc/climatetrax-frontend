"use client";
import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const DatasetAdd = dynamic(
  () => import("@/components/routes/dataset/connection/Add"),
  {
    ssr: false,
  }
);

import DataTable from "@/components/table/DataTable";
import { DataTableProps } from "@/types/declarations";

export default function Page({ rows, columns }: DataTableProps) {
  return (
    <>
      <div className="flex flex-row">
        <div className="basis-2/3">
          <DataTable rows={rows} columns={columns} cntx="connection" />
        </div>
        <div className="basis-1/3">
          <DatasetAdd />
        </div>
      </div>
    </>
  );
}
