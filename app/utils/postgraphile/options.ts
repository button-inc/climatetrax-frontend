import { Options } from "postgraphile";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import PgOrderByRelatedPlugin from "@graphile-contrib/pg-order-by-related";

export const options: Options = {
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain: true,
  dynamicJson: true,
  cors: false,
  absoluteRoutes: false,
  disableQueryLog: false,
  enableCors: false,
  ignoreRBAC: false,
  showErrorStack: false,
  watchPg: false,
  appendPlugins: [
    PgSimplifyInflectorPlugin,
    ConnectionFilterPlugin,
    PgOrderByRelatedPlugin,
  ],
};
