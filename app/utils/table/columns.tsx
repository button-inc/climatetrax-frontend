// 👇️ DataTable column definition- reflecting data response from gql query
import { ColumnItem } from "@/types/declarations";

export const columnsAnonymized: ColumnItem[] = [
  { name: "jobId", options: { display: false } },
  { label: "anonymized.datasets.columns.0", name: "fileName" },
  { label: "anonymized.datasets.columns.1", name: "nickname" },
  { label: "anonymized.datasets.columns.2", name: "submissionDate" },
  { label: "anonymized.datasets.columns.3", name: "email" },
];
export const columnsAnonymizedArea: ColumnItem[] = [
  { label: "anonymized.area.columns.0", name: "fileName" },
  { label: "anonymized.area.columns.1", name: "nickname" },
  { label: "anonymized.area.columns.2", name: "submissionDate" },
  { label: "anonymized.area.columns.3", name: "email" },
];

export const columnsDatasetAvailable: ColumnItem[] = [
  { name: "jobId", options: { display: false } },
  { label: "dataset.available.columns.0", name: "fileName" },
  { label: "dataset.available.columns.1", name: "nickname" },
  { label: "dataset.available.columns.2", name: "submissionDate" },
  { label: "dataset.available.columns.3", name: "email" },
];
export const columnsDatasetConnection: ColumnItem[] = [
  { label: "dataset.connection.columns.0", name: "fileName" },
  { label: "dataset.connection.columns.1", name: "nickname" },
  { label: "dataset.connection.columns.2", name: "submissionDate" },
  { label: "dataset.connection.columns.3", name: "email" },
];

export const columnsImported: ColumnItem[] = [
  { name: "jobId", options: { display: false } },
  { label: "imported.datasets.columns.0", name: "fileName" },
  { label: "imported.datasets.columns.1", name: "nickname" },
  { label: "imported.datasets.columns.2", name: "submissionDate" },
  { label: "imported.datasets.columns.3", name: "email" },
  { label: "imported.datasets.columns.4", name: "sensitivity" },
];
export const columnsImportedArea: ColumnItem[] = [
  { label: "imported.area.columns.0", name: "columnTitle" },
  { label: "imported.area.columns.1", name: "identifiedInfoType" },
  { label: "imported.area.columns.2", name: "maxLikelihood" },
  { label: "imported.area.columns.3", name: "quotes" },
  { label: "imported.area.columns.4", name: "toAnonymize" },
];
