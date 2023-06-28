import { cookies } from "next/headers";
import { request, Variables } from "graphql-request";
import { GraphqlResponse } from "@/types/declarations";
import fs from "fs";

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

/**
 * Log message to stout or local json file
 * @param message - The message to log
 */
export const logMessage = (msg: string): void => {
  const errorData = {
    timestamp: new Date().toISOString(),
    type: "upload",
    error: msg,
  };
  // logs the error message to the standard output (stdout)
  // captured in the container's logs within a Kubernetes cluster, or terminal
  // Google Kubernetes Engine (GKE) offer built-in stout log management solutions
  /* To view the error messages captured in a container's logs in a Kubernetes cluster:
  kubectl get pods
  kubectl logs <pod-name>
  kubectl logs nextjs-app-66cd4f4cd7-kgxlq
  OR
  Cloud Code\Kubernetes\minikube\Namespaces\default\pods: right click\view logs
  */
  console.error(JSON.stringify(errorData));
  // variable that is automatically set within a Kubernetes cluster when running containers using the Kubernetes Service
  if (!process.env.KUBERNETES_SERVICE_HOST) {
    // Not running in a Kubernetes cluster, write to file
    const fs = require("fs");
    const errorLogPath = "./app/logs/errors/file.json";
    fs.appendFile(
      errorLogPath,
      JSON.stringify(errorData) + "\n",
      (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.error("Error writing to error log:", err);
        }
      }
    );
  }
};
