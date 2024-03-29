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
│ ├── i18n
│ │ └── locales
│ │ └── en
│ │ └── home.json
│ │ └── en-US
│ │ └── home.json

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

## postgraphile

WIP

## Authenticating with GCP

The `GOOGLE_APPLICATION_CREDENTIALS` environment variable is used by various Google Cloud client libraries and command-line tools to authenticate and authorize access to Google Cloud services. It specifies the path to the service account key file, also known as the Application Default Credentials (ADC) file.

Here's how it works:

1. Service Account Key File: To authenticate with Google Cloud services, you need a service account key file. This file contains the necessary information to identify and authorize your application to access Google Cloud resources. It typically includes a private key, client email, and other metadata.
   Example:

   - ([cloud-build-sa@emissions-elt-demo.iam.gserviceaccount.com](mailto:cloud-build-sa@emissions-elt-demo.iam.gserviceaccount.com)).
   - Generate a service account key file for the selected service account.
   - Download the key file in JSON format to your local machine.

2. Setting the Environment Variable: By setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, you provide the path to the service account key file on your local machine. The Google Cloud client libraries and tools check this variable to locate the credentials file when making API calls.

3. Automatic Authentication: When your application or tool attempts to access Google Cloud services using the client libraries or tools, they automatically look for the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. If the variable is set, the library or tool uses the specified credentials file to authenticate your application and authorize access to the requested resources.

4. Authorization and Access Control: The credentials file contains the necessary permissions and roles assigned to the service account. This determines what actions your application can perform and which resources it can access within your Google Cloud project.

By properly setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, you ensure that the Google Cloud client libraries and tools can authenticate your application and interact with Google Cloud services on your behalf.

To set the **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable within Visual Studio Code (VSC) to only affect the environment within that specific IDE session:

1. Set the **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable in a terminal you can use the following command:

Linux/Mac: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/keyfile.json

```
export GOOGLE_APPLICATION_CREDENTIALS=credentials/service-account-key-gcs.json
```

To echo the value of the **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable in a terminal you can use the following command:

Linux/Mac:

```
echo $GOOGLE_APPLICATION_CREDENTIALS
```

To unset the **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable in a terminal, you can use the following command:

Linux/Mac:

```
unset GOOGLE_APPLICATION_CREDENTIALS
```

To set the **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable **globally for all command prompt or terminal sessions**, you'll need to modify the environment variables configuration of your operating system. The exact steps may vary depending on your operating system. Here are the general instructions for the most common operating systems:

On Linux or macOS:

1. Open a terminal.
2. Locate the file that sets the environment variables for your shell. This file can vary based on the shell you are using. Common files include `~/.bashrc`, `~/.bash_profile`, `~/.zshrc`, or `/etc/profile`.
3. Open the file in a text editor with administrative privileges (e.g., using `sudo`).
4. Add the following line to the file, specifying the path to your service account key file:

   ```
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

   Replace `/path/to/service-account-key.json` with the actual path to your service account key file.

5. Save the file.
6. Restart your terminal or run the `source` command to reload the environment variables in your current session.

## Testing

### Playwright

[Playwright](https://playwright.dev/) is a powerful browser automation library that allows you to control web browsers programmatically.
Playwright comes with the ability to generate tests out of the box and is a great way to quickly get started with testing.

**Creating tests**

You can run codegen and perform actions in the browser recorded as test scripts. Codegen will open two windows, a browser window where you interact with the website you wish to test and the Playwright Inspector window where you can record your tests, copy the tests, clear your tests as well as change the language of your tests. Playwright will generate the code for the user interactions. Codegen will look at the rendered page and figure out the recommended locator, prioritizing role, text and test id locators. If the generator identifies multiple elements matching the locator, it will improve the locator to make it resilient and uniquely identify the target element, therefore eliminating and reducing test(s) failing and flaking due to locators.

Use the codegen command to run the test generator followed by the URL of the website you want to generate tests for. The URL is optional and you can always run the command without it and then add the URL directly into the browser window instead.

```
npx playwright codegen http://localhost:3000/
```

You can also write tests manually following these suggested best practices:

1. Use the right browser context: Playwright provides three browser options: `chromium`, `firefox`, and `webkit`. Choose the browser that best suits your needs in terms of features, performance, and compatibility.

2. Close browser instances: Always close the browser instances and associated resources using the `close()` method. Failing to close the browser can lead to memory leaks and unexpected behavior.

3. Reuse browser contexts: Reusing browser contexts can improve performance. Instead of creating a new context for each new page, consider creating a shared context and reusing it across multiple pages.

4. Use the `waitFor` methods: Playwright offers `waitFor` methods (e.g., `waitForSelector`, `waitForNavigation`) that allow you to wait for specific conditions before proceeding with further actions. This helps ensure that the page has fully loaded or the desired element is available before interacting with it.

5. Emulate network conditions: Playwright allows you to emulate various network conditions, such as slow connections or offline mode, using the `context.route` and `context.routeOverride` methods. This can be helpful for testing how your application behaves under different network scenarios.

6. Handle errors and timeouts: Playwright operations can sometimes fail due to network issues, element unavailability, or other reasons. Properly handle errors and timeouts by using `try-catch` blocks and setting appropriate timeout values for operations like navigation or element waiting.

7. Use `click` and `type` with caution: While using `click` and `type` methods, make sure to target the correct element and account for any potential delays caused by JavaScript events or animations on the page.

8. Configure viewport and device emulation: Playwright allows you to set the viewport size and emulate different devices using the `page.setViewportSize` and `page.emulate` methods. Adjusting the viewport and device emulation can help test the responsiveness of your application.

9. Use selective screenshotting: Capture screenshots strategically to minimize resource usage. Avoid taking excessive screenshots or capturing unnecessary parts of the page unless required for debugging or reporting.

10. Run in headless mode: Consider running Playwright in headless mode (`headless: true`) for improved performance and resource utilization, especially in production or non-visual testing scenarios.

11. Follow Playwright documentation: Playwright has comprehensive documentation with detailed guides, examples, and API references. Consult the official Playwright documentation (https://playwright.dev/) for specific use cases, best practices, and updates.

**Running tests**

Running tests can be completed using the package.json\scripts as follows:

Testing end to end:

```
pnpm run test:e2e
```

Testing i18n:

```
pnpm run test:i18n
```

Testing GCS file upload:

```
pnpm run test:gcs
```

**Note**: `pnpm run test:gcs` will run a script `scripts/tests/test-gcs.sh` that configures GOOGLE_APPLICATION_CREDENTIALS from service-account-key.json information stored as a stringify JSON object in `scripts\tests\.env`, for use of the [service account](https://console.cloud.google.com/iam-admin/serviceaccounts/details/106707473171516793046?project=emissions-elt-demo) permisions for GCS authentication.


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

### run Docker container

#### Docker:

Docker is a platform that allows you to build, package, and distribute applications using containerization. You can download and install Docker from the official website based on your operating system: [Docker](https://www.docker.com/get-started)
A Dockerfile sets up a Node.js environment, installs dependencies, copies the application code, builds the Next.js application, exposes port 3000, and starts the application.

#### Docker Compose

Docker Compose is a tool that allows you to define and manage multi-container Docker applications. It simplifies the process of running multiple interconnected containers as a single application.
Using Docker Compose, you can easily spin up your entire application stack with a single command. It handles the orchestration and provisioning of containers, networks, and volumes, making it convenient for development, testing, and even production deployments.

#### Docker Desktop

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

3. run script

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

The output of `k8s` will be displayed in the terminal to confirm failure or success of setting a Kubernetes secret using shell "scripts\k8s-secrets.sh"; after which, Cloud Code\Run Kubernetes should launch
