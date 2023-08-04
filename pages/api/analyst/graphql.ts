/*
Next.js pages\API route handler method receives two arguments: req and res.

The req argument represents the incoming HTTP request to the API route.
It contains information about the request, such as headers, query parameters, request body, and more.
It is an instance of the Node.js http.IncomingMessage class.

The res argument represents the HTTP response object that you use to send a response back to the client.
 It provides methods for setting response headers, writing the response body, and managing the response status code.
 It is an instance of the Node.js http.ServerResponse class.

The req object is an instance of http.IncomingMessage, and it represents the request information received from the client sending the request,
it also includes the request body, query, headers, method, URL, etc.
Next.js also provides built-in middlewares for parsing and extending the incoming request (req) object. These are the middlewares:

req.body: By default, Next.js parses the request body, so you don’t have to install another third-party body-parser module. req.body comprises an object parsed by content-type as specified by the client. It defaults to null if no body was specified.

req.query: Next.js also parses the query string attached to the request URL. req.query is an object containing the query parameters and their values, or an empty object {} if no query string was attached.

req.cookies: It contains the cookies sent by the request. It also defaults to an empty object {} if no cookies are specified.

The response (res) object. It is an instance of http.ServerResponse, with additional helper methods

res.json(body): It is used to send a JSON response back to the client. It takes as an argument an object which must be serializable.

res.send(body): Used to send the HTTP response. The body can either be a string, an object or a buffer.

res.status(code): It is a function used to set the response status code. It accepts a valid HTTP status code as an argument.

Next.js provides a config object that, when exported, can be used to change some of the default configurations of the application. It has a nested api object that deals with configurations available for API routes.

For example, we can disable the default body parser provided by Next.js.
*/

import { postgraphile } from "postgraphile";
import { pgAnalyst } from "@/utils/postgraphile/pool/pgAnalyst";
import { options } from "@/utils/postgraphile/options";

const databaseSchemaAdmin = process.env.DATABASE_SCHEMA_ADMIN || "";
const databaseSchemaClean = process.env.DATABASE_SCHEMA_CLEAN || "";
const databaseSchemaWorkspace = process.env.DATABASE_SCHEMA_WORKSPACE || "";

// 👇️ customize the default configuration of the API route by exporting a config object in the same file
export const config = {
  api: {
    bodyParser: false, // Defaults to true. Setting this to false disables body parsing and allows you to consume the request body as stream or raw-body.
    responseLimit: false, // Determines how much data should be sent from the response body. It is automatically enabled and defaults to 4mb.
    externalResolver: true, // Disables warnings for unresolved requests if the route is being handled by an external resolver
  },
};

// 👇️ postgraphile function returns an object assigned to the requestHandler variable
const requestHandler = postgraphile(
  pgAnalyst,
  [databaseSchemaAdmin, databaseSchemaClean, databaseSchemaWorkspace],
  {
    ...options,
    // 👇️ specifies the role based route where this GraphQL API will be accessible
    graphqlRoute: "/api/analyst/graphql",
  }
);

/*When a request is made to the specified Next.js route, the requestHandler executes the logic provided by PostGraphile.
It connects to the PostgreSQL database using the provided connection pool (pgAnalyst) and exposes a GraphQL API based on the specified schemas and options.
It handles the execution of GraphQL queries and returns the corresponding data as per the GraphQL request.*/
export default requestHandler;
