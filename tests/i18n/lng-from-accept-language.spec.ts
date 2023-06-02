import { test, expect, chromium } from "@playwright/test";
import { lngs, siteUrl } from "./testUtils";

const acceptLanguages =
  "en;q=0.1, en-CA;q=0.2, en-GB;q=0.3, en-US;q=0.4, fr;q=0.5, fr-CA;q=1.0";

// Language Redirection Tests
test.describe("Accept-Language Language Redirection", () => {
  let browser: any;
  let context: any;
  let page: any;

  // The 'beforeAll' hook runs once before any tests in the test suite
  test.beforeAll(async () => {
    // Launch the browser
    browser = await chromium.launch();
  });

  // The 'afterAll' hook runs once after all the tests in the test suite have finished
  test.afterAll(async () => {
    // Close the browser
    await browser.close();
  });

  // The 'beforeEach' hook runs before each individual test case
  test.beforeEach(async () => {
    // Create a new browser context for each test
    context = await browser.newContext();
    // Create a new page in the context
    page = await context.newPage();
  });

  // The 'afterEach' hook runs after each individual test case
  test.afterEach(async () => {
    // Close the browser context and page
    await context.close();
  });

  // Test cases go here...

  // Test language redirection for each Accept-Language language
  for (const lng of lngs) {
    test(`Page should redirect to ${lng} version when Accept-Language is set to "${lng}"`, async () => {
      // Create a new browser context for each test with desired locale
      context = await browser.newContext({ locale: lng });
      page = await context.newPage();

      // Navigate to the site URL
      await page.goto(siteUrl);

      // Expect the URL to have the correct language prefix
      await expect(page).toHaveURL(new RegExp(`^${siteUrl}/${lng}/?$`));
    });
  }

  // Test language redirection for multiple languages in Accept-Language header
  test(`Page should redirect to highest priority language when multiple languages are set in Accept-Language header`, async () => {
    // Create a new browser context for each test with desired locale
    context = await browser.newContext({ locale: acceptLanguages });
    page = await context.newPage();

    // Navigate to the site URL
    await page.goto(siteUrl);

    // The language with highest priority in the Accept-Language header with q of 1.0
    const highestPriorityLanguage = 'fr-CA';

    // Expect the URL to have the language prefix of the highest priority language
    await expect(page).toHaveURL(new RegExp(`^${siteUrl}/${highestPriorityLanguage}/?$`));
  });
});
