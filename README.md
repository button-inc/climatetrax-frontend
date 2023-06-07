# ClimateTrax

ClimateTrax frontend is a [Next.js 13](https://nextjs.org/blog/next-13) app that is Dockerized, K8s configured using Cloud Code to run local minikube, secured using next.js middleware,next-auth and OpenID, internationalized using i18next with a GraphQL CRUD API using postgraphile.
Current styling using tailwind and headlessui.

## PNMP

Fast, disk space efficient package manager:

- **Fast.** Up to 2x faster than the alternatives (see [benchmark](#benchmark)).
- **Efficient.** Files inside `node_modules` are linked from a single content-addressable storage.
- **[Great for monorepos](https://pnpm.io/workspaces).**
- **Strict.** A package can access only dependencies that are specified in its `package.json`.
- **Deterministic.** Has a lockfile called `pnpm-lock.yaml`.
- **Works as a Node.js version manager.** See [pnpm env use](https://pnpm.io/cli/env).
- **Works everywhere.** Supports Windows, Linux, and macOS.
- **Battle-tested.** Used in production by teams of [all sizes](https://pnpm.io/users) since 2016.
- [See the full feature comparison with npm and Yarn](https://pnpm.io/feature-comparison).

To quote the [Rush](https://rushjs.io/) team:

> Microsoft uses pnpm in Rush repos with hundreds of projects and hundreds of PRs per day, and we’ve found it to be very fast and reliable.

## Background

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

## Getting Started

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

# Next.js 13

[Next.js 13](https://nextjs.org/blog/next-13-4) introduced a new file-system based router which works in a new directory named app.

[app routes](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory) can be accessed on [http://localhost:3000](http://localhost:3000).

Currently, ClimateTrax has a dynamic folder, [lng], to allow multi-lingual support

You can edit the server page by modifying `app\[lng]\page.tsx`.
You can edit the client page by modifying `app\[lng]\client\page.tsx`.

## Next.js 13 middlewares

Next.js [Middleware ](https://nextjs.org/docs/advanced-features/middleware) allows control over requests before they are completed. Responses can be modified based on conditions such as authentication session or language detection along with implementing persistence via cookie. To create secured routes in Next.js, middleware functions are required to authenticate and authorize the requests made to the route before allowing access to it.
ClimateTrax uses higher-order functions to create middleware functions with a utility function that uses recursion of separated the logical functions; such as, withLocalization, withResponse that manage the localization prefix; headers and cookies for translation management.

# i18next

Multi-lingual functionality within the Next.js app directory is realized using [i18next](https://www.i18next.com).

See [blog post](https://locize.com/blog/next-13-app-dir-i18n) for more detail.

Note: For ClimateTrax, the locale management happens in middlewares and i18n libraries so that the i18n instance performs cascading lookups of json files in a i18n\locale folder based on region specific to broader language default structure:

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

# Running App Locally

## run dev server

1. Install dependencies (from the folder relative to the package.json file):

```
pnpm install
```

2. Create an .env file in app root folder

3. Start the dev server:

```
pnpm run dev
```

## run container

```
docker compose -f docker-compose.dev.yml up -d
```

## run minikube

- Launch "Cloud "Code" from the right-hand status bar
- Select "Run on Kubernetes" in the display prompt

## run tests
1. Start the dev server:

```
pnpm run dev

```
2.a launch playwright for tests:

```
pnpm run test
```
2.b launch playwright for i18next tests:

```
pnpm run test:i18n
```