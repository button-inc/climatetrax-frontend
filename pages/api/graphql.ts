import { postgraphile } from "postgraphile";
import { pgAdmin } from "@/utils/postgraphile/pool/pgAdmin";
import { options } from "@/utils/postgraphile/options";

const databaseSchemaAdmin = process.env.DATABASE_SCHEMA_ADMIN || "";
const databaseSchemaClean = process.env.DATABASE_SCHEMA_CLEAN || "";
const databaseSchemaWorkspace = process.env.DATABASE_SCHEMA_WORKSPACE || "";

const requestHandler = postgraphile(
  pgAdmin,
  [databaseSchemaAdmin, databaseSchemaClean, databaseSchemaWorkspace],
  {
    ...options,
    graphqlRoute: "/api/graphql",
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};
export default requestHandler;
