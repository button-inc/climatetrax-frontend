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
