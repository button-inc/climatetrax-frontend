"use client";
import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HubIcon from "@mui/icons-material/Hub";
import { useTranslation } from "@/i18n/client";
import { DataTableProps } from "@/types/declarations";

export default function DataTable({
  rows,
  columns,
  cntx,
}: DataTableProps): JSX.Element {
  // 👇️ language management
  const { t } = useTranslation("translation");
  // 👇️ translations
  columns.forEach((item) => {
    if (item.label !== null && item.label !== undefined) {
      item.label = t(item.label);
    }
  });
  const [opts, setOpts] = useState<any>({});

  const handleClickIcon = (icon: string) => {
    window.location.assign("./" + icon);
  };

  const handleClickRow = (rowData: any) => {
    window.location.assign(
      window.location + "/" + rowData[0] + "?area=" + rowData[1]
    );
  };

  useEffect(() => {
    switch (cntx) {
      case "available":
        // 👇️ temp icons in toolbar to navigate to "Add new..."
        setOpts({
          customToolbar: () => (
            <>
              <Tooltip title={t("available.buttons.dataset.tooltip")}>
                <IconButton onClick={() => handleClickIcon("add")}>
                  <DataObjectIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("available.buttons.connection.tooltip")}>
                <IconButton onClick={() => handleClickIcon("connection")}>
                  <HubIcon />
                </IconButton>
              </Tooltip>
            </>
          ),
        });
        break;
      case "anonymized":
        setOpts({ onRowClick: handleClickRow });
        break;
      case "dlpAnalysis":
        // 👇️ get first quote from quote array for example
        if (rows) {
          rows = rows.map((row) => ({
            ...row,
            quotes: row[0] || "",
          }));
        }
        const toAnonymizeIndex = columns.findIndex(
          (e) => e.name === "toAnonymize"
        );
        columns[toAnonymizeIndex] = {
          ...columns[toAnonymizeIndex],
          options: {
            customBodyRender: (value: boolean) => (
              <Checkbox checked={value} disabled size="small" />
            ),
          },
        };
        break;
      case "imported":
        // 👇️ change 'Sensitivity' column to link to dlp Analysis page
        const sensitivityIndex = columns.findIndex(
          (e) => e.name === "sensitivity"
        );
        columns[sensitivityIndex] = {
          ...columns[sensitivityIndex],
          options: {
            customBodyRender: () => (
              <span>{t("imported.links.report.title")}</span>
            ),
          },
        };
        setOpts({ onRowClick: handleClickRow });
        break;
      case "connection":
        // 👇️ add edit button to first column for each row
        if (!columns.some((e) => e.id === "edit")) {
          columns.unshift({
            id: "edit",
            name: "",
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value: any, tableMeta: any) => (
                <button onClick={() => console.log(tableMeta)}>Edit</button>
              ),
            },
          });
        }
        break;
      default:
        setOpts({});
        break;
    }
  }, []);

  // 👇️ DataTable options
  const options = {
    ...opts,
    search: true,
    download: true,
    viewColumns: true,
    print: false,
    filter: true,
    filterType: "dropdown",
    tableBodyHeight: "400px",
    selectableRows: "none",
  };
  // 👉️ RETURN: MUI datatable
  return (
    <MUIDataTable title="" data={rows} columns={columns} options={options} />
  );
}
