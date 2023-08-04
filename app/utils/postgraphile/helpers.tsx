import { cookies } from "next/headers";
import { request, Variables } from "graphql-request";
import { GraphqlResponse } from "@/types/declarations";
import { authOptions } from "@/utils/api/auth/auth";
import { getServerSession } from "next-auth/next";
/**
 * Flatten a nested JSON object
 * @param object - The JSON object with nested JSON objects
 */
export const flattenJSON = (
  object: Record<string, any>
): Record<string, any> => {
  try {
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
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};

/**
 * Get server side session user role
 */

export const getSessionRoleEndpoint = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "";
  const endpoint = "api/" + role + "/graphql";
  return endpoint;
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
  try {
    // 👇️ variables for graphql-request
    const variables: Variables = {};
    //  ❗ IMPORTANT - 🍪 cookies: For serverside requests, add the browser session cookie with the encrypted JWT to this server-side API request to be used by middleware for route protection
    const headers = {
      Cookie:
        "next-auth.session-token=" +
        cookies().get("next-auth.session-token")?.value,
    };
    // console.log(cookies().get("next-auth.session-token")?.value);
    endpoint = process.env.API_HOST + endpoint;
    // 👇️ data fetching via graphql-request
    const response: GraphqlResponse = await request(
      endpoint,
      query,
      variables,
      headers
    );

    // 🪓 mild hack....
    // 👇️ get the nodes of the first object from the response
    const nodes = response[Object.keys(response)[0]].nodes;
    // 👇️ flatten nested nodes
    const data = nodes.map((obj) => flattenJSON(obj));
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
