# ClimateTrax

ClimateTrax frontend is a [Next.js 13](https://nextjs.org/blog/next-13) app that is Dockerized, K8s configured using Cloud Code to run local minikube, internationalized using i18next.
Current styling using tailwind and headlessui.

## PNMP

Fast, disk space efficient package manager:

- **Fast.** Up to 2x faster than the alternatives (see [benchmark](#benchmark)).
- **Efficient.** Files inside `node_modules` are linked from a single content-addressable storage.
- **[Great for monorepos](https://pnpm.io/workspaces).**
- **Strict.** A package can access only dependencies that are specified in its `package.json`.
- **Deterministic.** Has a lockfile called `pnpm-lock.yaml`.
- **Works as a Node.js version manager.** See [pnpm env use](https://pnpm.io/cli/env).
- **Works everywhere.** Sup
  s Windows, Linux, and macOS.
- **Battle-tested.** Used in production by teams of [all sizes](https://pnpm.io/users) since 2016.
- [See the full feature comparison with npm and Yarn](https://pnpm.io/feature-comparison).

To quote the [Rush](https://rushjs.io/) team:

> Microsoft uses pnpm in Rush repos with hundreds of projects and hundreds of PRs per day, and we’ve found it to be very fast and reliable.

### PNPM Background

pnpm uses a content-addressable filesystem to store all files from all module directories on a disk.
When using npm, if you have 100 projects using lodash, you will have 100 copies of lodash on disk.
With pnpm, lodash will be stored in a content-addressable storage, so:

1. If you depend on different versions of lodash, only the files that differ are added to the store.
   If lodash has 100 files, and a new version has a change only in one of those files,
   `pnpm update` will only add 1 new file to the storage.
1. All the files are saved in a single place on the disk. When packages are installed, their files are linked
   from that single place consuming no additional disk space. Linking is performed using either hard-links or reflinks (copy-on-write).

As a result, you save gigabytes of space on your disk and you have a lot faster installations!
If you'd like more details about the unique `node_modules` structure that pnpm creates and
why it works fine with the Node.js ecosystem, read this small article: [Flat node_modules is not the only way](https://pnpm.io/blog/2020/05/27/flat-node-modules-is-not-the-only-way).

### Getting Started

[Install PNPM](https://pnpm.io/installation), if you haven’t already:

Ensure you have node.js and the correct version (16.4 as of this writing):

```
node -v
```

To update Node.js:

```
npm cache clean -f
npm install -g n latest
n stable
```

To install the latest release, use n latest. Alternatively, you can run n #.#.# to get a specific Node.js version.

**Note**: If you are using asdf package version manager, [good luck :)](https://blog.logrocket.com/manage-node-js-versions-using-asdf/)

To install pnpm:

```
npm i -g pnpm
```

PNPM creates a pnpm-lock.yaml file to store the dependency tree which is similar to package-lock.json or yarn.lock that are created by npm and yarn.
Now that you have a project created, cd into the project and run pnpm run dev to run the development server.

```
cd new-next-app
pnpm run dev
```

Similarly, you also run project scripts just the way you would with npm. You can also define your own scripts inside the package.json file and run it with npm the same way you would with plain npm.

To install packages use

```
pnpm add package-name
```

to install the latest version of package-name from the npm registry by default.

## Next.js 13

[Next.js 13](https://nextjs.org/blog/next-13-4) introduced a new file-system based router which works in a new directory named app.

[app routes](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory) can be accessed on [http://localhost:3000](http://localhost:3000).

**FYI:** The easiest way to get started with Next.js is by using create-next-app. This CLI tool enables you to quickly start building a new Next.js application, with everything set up for you. You can create a new app using the default Next.js template, or by using one of the official Next.js examples. To get started, use the following command:

```
pnpm create next-app
```

You will then be asked the following prompts:

```
What is your project named?  my-app
Would you like to add TypeScript with this project?  Y/N
Would you like to use ESLint with this project?  Y/N
Would you like to use Tailwind CSS with this project? Y/N
Would you like to use the `src/ directory` with this project? Y/N
What import alias would you like configured? `@/*`
Once you've answered the prompts, a new project will be created with the correct configuration depending on your answers.
```

**Note**
Next.js comes with built-in support for ESLint, to enforce code formatting rules for maintaining code consistency in the project.
You can enforce a strict set of code formatting rules for team members configure the .eslintrc.json file at the very root level of your project. This file allows you to write eslint rules in key-value pairs.
ESLint does its job pretty well, but when paired with Prettier, it can be even more powerful, providing a consistent coding format for all team members across the organization.
You can achieve this by installing the prettier package to the project like so:

```
pnpm add prettier -D
```

Once the installation has been finished, create two files at the root level — the same level as the eslintrc.json file. These files should be named .prettierrc and .prettierignore.

You can run prettier on your code by using a command or script, defined in the package.json file, or by installing prettier-vscode using the extension sidebar – it’s called “Prettier - Code formatter.”

```
pnpm run prettier
```

## Next.js 13 middlewares

Next.js [Middleware ](https://nextjs.org/docs/advanced-features/middleware) allows control over requests before they are completed. Responses can be modified based on conditions such as authentication session or language detection along with implementing persistence via cookie. To create secured routes in Next.js, middleware functions are required to authenticate and authorize the requests made to the route before allowing access to it.
ClimateTrax uses higher-order functions to create middleware functions with a utility function that uses recursion of separated the logical functions; such as, withLocalization, withResponse that manage the localization prefix; headers and cookies for translation management.

## i18next

Multi-lingual functionality within the Next.js app directory is realized using [i18next](https://www.i18next.com).

See [blog post](https://locize.com/blog/next-13-app-dir-i18n) for more detail.
docker ps
ClimateTrax uses middlewares and i18n libraries to manage locale setting and translations so that the i18n instance performs cascading lookups of json files in a i18n\locale folder based on region specific to broader language default structure:

**File structure:**
│   ├── i18n
│   │   └── locales
│   │   └── en
│   │   └── home.json
│   │   └── en-US
│   │   └── home.json

**en\home.json**

{
"hi": "Hello",
"msg": "Important message for all to see"
}

**en-US\home.en**

{
"hi": "Hello USA",
}

**User Story:**

> **\***As a**\*** developer,
> **\*\*\***I want**\*\*\*** the i18n locale configuration “en-US” to display the following translations: t(”hi”)= “Hello USA” , t(”msg”)= “Important message for all to see”
> **\*\*\*\***so that**\*\*\*\*** the translations can be DRY and contextually accurate when required

**Some test urls **

- /
- /en
- /en-CA
- /en-GB
- /en-US
- /fr
- /fr-CA

## NextAuth.js

Authentication and authorization functionality is realized using NextAuth.js, an open source community project.
See [NextAuth.js repo](https://github.com/nextauthjs/next-auth) to learn more.

Within ClimateTrax, the next-auth functionality lies within folder `app\api\[...nextauth]\route.ts` and is managed within `middleware.ts` and `middlewares\withAuthorization.ts`

## Google Cloud Client Libraries

Google Cloud Client Libraries are a set of libraries developed by Google to interact with various Google Cloud services. These client libraries provide idiomatic and convenient ways to access and use Google Cloud services.
The client libraries integrate with Google Cloud authentication mechanisms, such as Application Default Credentials (ADC) and service account key files. This allows your application to authenticate and authorize with Google Cloud services seamlessly.

To configure the local environment to use Application Default Credentials (ADC) authentication for Google Cloud services, follow these steps:

1. Set up your Google Cloud project:
   - Create a new project or use an existing project in the Google Cloud Console (https://console.cloud.google.com/).
   - Enable the necessary APIs for the services you want to use. For example, enable the Cloud Storage API if you're working with Google Cloud Storage.
   - Create a service account:
     - Go to the "IAM & Admin" section in the Cloud Console.
     - Select "Service Accounts" and click on "Create Service Account".
     - Provide a name and optional description for the service account.
     - Assign the desired roles to the service account based on the permissions it needs. For example, if you're using Cloud Storage, you can assign the "Storage Object Admin" or "Storage Object Viewer" role.
     - Choose the key type (JSON is recommended) and click on "Create" to generate and download the service account key file (credentials file). This file contains the necessary credentials for authentication.
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the path of the downloaded service account key file. This variable tells the client libraries where to find the credentials. For example, you can set it in your terminal session or add it to your project's configuration file:
     - Linux/Mac:
       ```
       export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/credentials.json
       ```
2. Initialize the client library with ADC:
   - In your code, initialize the Google Cloud client library for the service you're using. The library will automatically detect the `GOOGLE_APPLICATION_CREDENTIALS` environment variable and use the specified credentials for authentication.
   - Each client library may have its own initialization method. Consult the documentation of the specific library you're using for the initialization steps.

By following these steps, your local environment will be configured to use ADC authentication, and the client libraries will automatically authenticate requests to Google Cloud services using the provided service account credentials.

## Running App Locally

### run dev server

1. Install all dependencies for a project (run command from the folder relative to the package.json file):

```
pnpm install
```

2. Create an .env file in app root folder

3. Start the dev server:

```
pnpm run dev
```

## run Docker container

### Docker:

Docker is a platform that allows you to build, package, and distribute applications using containerization. You can download and install Docker from the official website based on your operating system: [Docker](https://www.docker.com/get-started)
A Dockerfile sets up a Node.js environment, installs dependencies, copies the application code, builds the Next.js application, exposes port 3000, and starts the application.

### Docker Compose

Docker Compose is a tool that allows you to define and manage multi-container Docker applications. It simplifies the process of running multiple interconnected containers as a single application.
Using Docker Compose, you can easily spin up your entire application stack with a single command. It handles the orchestration and provisioning of containers, networks, and volumes, making it convenient for development, testing, and even production deployments.

### Docker Desktop

Docker Desktop is a software application that provides an easy-to-use graphical interface and toolset for working with Docker containers on your local machine. It is available for both Windows and macOS operating systems. [Download](https://www.docker.com/products/docker-desktop)

To run this app in a docker container via a docker compose file run command from the directory where `docker-compose.dev.yml` file is located.

```
docker compose -f docker-compose.dev.yml up -d --build

```

To view the running container open a browser at http://localhost:3000/
To stop a local Docker container launched using Docker Compose, you can use Docker Desktop UI or use command from the directory where `docker-compose.dev.yml` file is located:

```
docker-compose -f docker-compose.dev.yml down
```

By running `docker-compose -f docker-compose.dev.yml down`, Docker Compose will stop and remove the containers defined in the `docker-compose.dev.yml` file. This ensures proper cleanup and frees up the resources on your local machine.

## run k8s minikube

### Kubernetes

[Kubernetes (k8s) Like I am 5](https://www.cncf.io/phippy/the-childrens-illustrated-guide-to-kubernetes/)

File structure for local k8s cluster:
.
|---- .vscode
| └---- launch.json
|---- kubernetes-manifests
| |---- nextjs-app-deployment.yaml
| |---- nextjs-app-service.yaml
|---- Dockerfile
|---- skaffold.yaml
`

### Kubernetes secrets

When running the app in minikube the process.env.\* reflect Kubernetes secrets. To set the Kubernetes secrets from GCP Secret using scripts\k8s-secrets.sh:

1. Start k8s minikube:

```
minikube start

```

2. run script

```
cd scripts

```

```
bash k8s-secrets.sh

```

The terminal `output` tab will display the failure or success of setting a Kubernetes secret.

To see the secrets within a **running** Kubernetes cluster navigate to `Cloud Code\Kubernetes\minikube ACTIVE\Namespaces\Secrets` or use terminal command:

```
kubectl get secrets -o go-template='{{range $secret := .items}}{{ $secret.metadata.name }}{{ "\n" }}{{- range $key, $value := $secret.data }}{{ $key }}={{ $value | base64decode }}{{ "\n" }}{{- end }}{{ "\n" }}{{- end}}'

```

After secrets are set you can launch the app using Cloud Code:

- Launch "Cloud "Code" from the right-hand status bar
- Select "Run on Kubernetes" in the display prompt

OR (WIP) run a package.json script called "k8s" which will start a minikube, set the secrets from GCP and (?) launch the cluster using the skaffold.yaml:

```
pnpm run k8s
```
