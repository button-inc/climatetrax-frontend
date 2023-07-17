// defines types and interfaces used throughout the app

interface DefaultLayoutProps {
  children: ReactNode;
}

interface DataTableProps {
  rows: any[];
  columns: any[];
  cntx?: string | null;
}
interface GraphqlEndPoint {
  endpoint: string;
}

interface GraphqlQuery {
  endpoint: string;
  query: string;
  columns: any[];
  cntx?: string | null;
}

interface GraphqlResponse {
  [key: string]: {
    nodes: Record<string, any>[];
  };
}

interface GraphqlParamEndPoint {
  id: string;
}

interface TagProps {
  tag: string;
  crumbs: CrumbItem[];
}
export type ColumnItem = {
  label?: string | null;
  name: string;
  options?: { display?: boolean };
};

export type CrumbItem = {
  title: string;
  href: string;
};

export type CrumbItems = {
  items: CrumbItem[];
};
export type MenuItem = {
  href: string;
  button: string;
};

export type RouteItem = {
  button: string;
  content: string;
  href: string;
  title: string;
};
