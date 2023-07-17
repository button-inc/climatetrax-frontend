//record test: npx playwright codegen http://localhost:3000/en/analyst/dataset/add
//run tests: pnpm run test:gcs

//AC: https://www.notion.so/buttoninc/Playwright-Tests-for-GSC-ba1f819ac78d4d1ea0913664330a4f1c?pvs=4

import { test, expect, chromium, Page, BrowserContext } from "@playwright/test";
import path from "path";
import { Storage } from "@google-cloud/storage";

const dotenv = require("dotenv");
dotenv.config({
  path: "./tests/.env",
});

// 👇️ Test parameters
const siteUrl: string | undefined = process.env.API_HOST;
const fileNames = [
  "helloWorld.json",
  "helloWorld.xml",
  "helloWorld.csv",
  "helloWorld.xls",
  "helloWorld.xlsx",
];
const filePaths = fileNames.map((fileName) =>
  path.resolve(process.cwd(), "tests", "gcs", "files", fileName)
);

const fileFailPath = path.resolve(
  process.cwd(),
  "tests",
  "gcs",
  "files",
  "helloWorld.ods"
);

const lngs = ["en", "fr"];
const successMessageDictionary: { [key: string]: string } = {
  en: "Success",
  fr: "Succès",
};

// Create a new instance of the Storage class
const storage = new Storage();
const bucketName = process.env.GOOGLE_BUCKET_NAME as string;

// 👇️ Test fixtures
interface TestFixtures {
  browser: any;
  context: BrowserContext;
  page: Page;
}

// 👇️ Common assertions
async function assertIsMaskedDivHidden(page: Page) {
  await page.waitForSelector("div.--is-masked", { state: "hidden" });
  const isMaskedDiv = await page.$("div.--is-masked");
  const isMaskedDivVisible = isMaskedDiv
    ? await isMaskedDiv.isVisible()
    : false;
  expect(isMaskedDivVisible).toBe(false);
}

// 👇️ Test case: File Upload to GCS bucket
test.describe("File Upload to GCS bucket", () => {
  test.beforeAll(async () => {
    return {
      browser: await chromium.launch(),
    };
  });

  test.afterAll(async ({ browser }) => {
    await browser.close();
  });

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    return {
      context,
      page,
    };
  });

  test.afterEach(async ({ context }) => {
    await context.close();
  });

  // 👇️ Loop over language paths and file paths
  for (const lng of lngs) {
    for (const filePath of filePaths) {
      // 👇️ Test case: File Upload - supported file
      test(`Add dataset: file input event - onchange success (${lng}) - ${path.basename(
        filePath
      )}`, async ({ page }: TestFixtures) => {
        await page.goto(`${siteUrl}/${lng}/analyst/dataset/add`);

        const divElement = await page.waitForSelector("div[data-myFileInput]");

        const fileChooserPromise = new Promise<void>((resolve) => {
          page.on("filechooser", async (fileChooser) => {
            await fileChooser.setFiles(filePath);
            resolve();
          });
        });

        await divElement.click();
        await fileChooserPromise;

        // 👇️ Assert the success message text
        await page.waitForSelector(".bg-green-100");
        const successMessageSelector = ".bg-green-100 p:nth-child(1)";
        const successMessage = await page.textContent(successMessageSelector);
        const expectedSuccessMessage = successMessageDictionary[lng];
        expect(successMessage).toContain(expectedSuccessMessage);

        // 👇️ Assert the window mask is hidden
        await assertIsMaskedDivHidden(page);

        // 👇️ Assert the file exists in the GCP Storage bucket
        const fileName = path.basename(filePath);
        const [fileExists] = await storage
          .bucket(bucketName)
          .file(fileName)
          .exists();
        expect(fileExists).toBe(true);
      });
    }
  }
  // 👇️ Test case: File Upload - Failing file
  test("Add dataset: file input event - failing file", async ({
    page,
  }: TestFixtures) => {
    await page.goto(`${siteUrl}/en/analyst/dataset/add`);

    const divElement = await page.waitForSelector("div[data-myFileInput]");

    const fileChooserPromise = new Promise<void>((resolve) => {
      page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles(fileFailPath);
        resolve();
      });
    });

    await divElement.click();
    await fileChooserPromise;

    // 👇️ Assert the error message text
    await page.waitForSelector(".bg-orange-100");
    const errorMessageSelector = ".bg-orange-100 p:nth-child(1)";
    const errorMessage = await page.textContent(errorMessageSelector);
    expect(errorMessage).toContain("Error");

    // 👇️ Assert the window mask is hidden
    await assertIsMaskedDivHidden(page);
  });

  // 👇️ Test case: File Upload - Cancel
  test("Add dataset: file input event - cancel", async ({
    page,
  }: TestFixtures) => {
    await page.goto(`${siteUrl}/en/analyst/dataset/add`);

    const divElement = await page.waitForSelector("div[data-myFileInput]");

    const fileChooserPromise = new Promise<void>((resolve) => {
      page.on("filechooser", async (fileChooser) => {
        await page.evaluate(() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" })
          );
        });
        resolve();
      });
    });

    await divElement.click();
    await fileChooserPromise;

    // 👇️ Assert the window mask is hidden
    await assertIsMaskedDivHidden(page);
  });
});
