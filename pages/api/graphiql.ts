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
    graphiqlRoute: "/api/graphiql",
    graphqlRoute: "/api/graphql",
  }
);

export default requestHandler;
