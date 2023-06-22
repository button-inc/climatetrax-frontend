import { cookies } from "next/headers";
import { request, Variables } from "graphql-request";
import { GraphqlResponse } from "@/types/declarations";

/**
 * Flatten a nested JSON object
 * @param object - The JSON object with nested JSON objects
 */
export const flattenJSON = (
  object: Record<string, any>
): Record<string, any> => {
  let simpleObj: Record<string, any> = {};
  for (let key in object) {
    const value = object[key];
    const type = typeof value;
    if (
      ["string", "boolean"].includes(type) ||
      (type === "number" && !isNaN(value))
    ) {
      simpleObj[key] = value;
    } else if (type === "object") {
      // Recursive loop
      Object.assign(simpleObj, flattenJSON(value));
    }
  }
  return simpleObj;
};

/**
 * Perform a graphql-request to the API endpoint
 * @param endpoint - The API route
 * @param query - The postgraphile query
 */
export const getQueryData = async (
  endpoint: string,
  query: string
): Promise<any[]> => {
  // Variables for graphql-request
  endpoint = process.env.API_HOST + endpoint;

  const variables: Variables = {};
  // IMPORTANT: Add the browser session cookie with the encrypted JWT to this server-side API request
  // To be used by middleware for route protection
  const headers = {
    Cookie:
      "next-auth.session-token=" +
      cookies().get("next-auth.session-token")?.value,
  };
  // Data fetching via graphql-request
  const response: GraphqlResponse = await request(
    endpoint,
    query,
    variables,
    headers
  );
  // Get the nodes of the first object from the response
  const nodes = response[Object.keys(response)[0]].nodes;
  // Flatten nested nodes
  const data = nodes.map((obj) => flattenJSON(obj));

  // Return the data
  return data;
};

/**
 * Get a property by path utility - an alternative to lodash.get
 * @param object - The object to traverse
 * @param path - The path to the property
 * @param defaultValue - The default value if the property is not found
 */
export const getPropByPath = (
  object: Record<string, any>,
  path: string | string[],
  defaultValue?: any
): any => {
  const myPath = Array.isArray(path) ? path : path.split(".");
  if (object && myPath.length)
    return getPropByPath(object[myPath.shift()!], myPath, defaultValue);
  return object === undefined ? defaultValue : object;
};
