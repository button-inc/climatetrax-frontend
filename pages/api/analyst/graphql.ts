import { postgraphile } from "postgraphile";
import { pgAnalyst } from "@/utils/postgraphile/pool/pgAnalyst";
import { options } from "@/utils/postgraphile/options";

const databaseSchemaAdmin = process.env.DATABASE_SCHEMA_ADMIN || "";
const databaseSchemaClean = process.env.DATABASE_SCHEMA_CLEAN || "";
const databaseSchemaWorkspace = process.env.DATABASE_SCHEMA_WORKSPACE || "";

const requestHandler = postgraphile(
  pgAnalyst,
  [databaseSchemaAdmin, databaseSchemaClean, databaseSchemaWorkspace],
  {
    ...options,
    graphqlRoute: "/api/analyst/graphql",
  }
);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
export default requestHandler;
