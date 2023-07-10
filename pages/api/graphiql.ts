import { postgraphile } from "postgraphile";
import { pgAdmin } from "@/utils/postgraphile/pool/pgAdmin";
import { options } from "@/utils/postgraphile/options";

const databaseSchemaAdmin = process.env.DATABASE_SCHEMA_ADMIN || "";
const databaseSchemaClean = process.env.DATABASE_SCHEMA_CLEAN || "";
const databaseSchemaWorkspace = process.env.DATABASE_SCHEMA_WORKSPACE || "";
const databasePW = "fake_pw_to_test_gitleak";
const FAKE_AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const FAKE_AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";


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
