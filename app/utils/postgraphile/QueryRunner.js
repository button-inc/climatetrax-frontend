const { Pool } = require("pg");
const { graphql } = require("graphql");
const {
  withPostGraphileContext,
  createPostGraphileSchema,
} = require("postgraphile");

async function makeQueryRunner(
  connectionString,
  schemaName,
  options // See https://www.graphile.org/postgraphile/usage-schema/ for options
) {
  // Create the PostGraphile schema
  const schema = await createPostGraphileSchema(
    connectionString,
    schemaName,
    options
  );
  // Our database pool
  const pgPool = new Pool({
    connectionString,
  });

  console.log(
    "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
  );
  console.log(connectionString);
  console.log(schemaName);
  console.log(options);
  console.log(schema);
  // The query function for issuing GraphQL queries
  const query = async (
    graphqlQuery, // e.g. `{ __typename }`
    variables = {},
    jwtToken = null, // A string, or null
    operationName = null
  ) => {
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    console.log(schema);
    console.log(graphqlQuery);
    // pgSettings and additionalContextFromRequest cannot be functions at this point
    const pgSettings = options.pgSettings;

    console.log(graphqlQuery);
    return await withPostGraphileContext(
      {
        ...options,
        pgPool,
        jwtToken: jwtToken,
        pgSettings,
      },
      async (context) => {
        console.log(
          "============================================================================="
        );
        console.log(schema);
        console.log(graphqlQuery);
        // Do NOT use context outside of this function.
        return await graphql(
          schema,
          graphqlQuery,
          null,
          {
            ...context,
            /* You can add more to context if you like */
          },
          variables,
          operationName
        );
      }
    );
  };

  // Should we need to release this query runner, the cleanup tasks:
  const release = () => {
    pgPool.end();
  };

  return {
    query,
    release,
  };
}

exports.makeQueryRunner = makeQueryRunner;
