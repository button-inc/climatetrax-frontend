import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { createPageWithAcceptLanguage, lngs,siteUrl} from './testUtils';

async function createPage(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}

test.describe("Default Language Redirection", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    const { browser: launchedBrowser } = await createPage();
    browser = launchedBrowser;
  });

  test.beforeEach(async () => {
    const { context: createdContext, page: createdPage } = await createPage();
    context = createdContext;
    page = createdPage;
  });

  test.afterEach(async () => {
    await page.close();
    await context.close();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  for (const lng of lngs) {
    test(`Server should respond with correct Content-Language: ${lng}`, async () => {
      const response = await page.goto(`${siteUrl}/${lng}`);
      expect(response?.headers()["content-language"]).toBe(lng);
    });
  }

  test(`URL prefix takes precedence over i18next cookie value`, async () => {
    await context.addCookies([
      {
        name: "i18next",
        value: "en-GB",
        url: siteUrl,
      },
    ]);
    await page.goto(`${siteUrl}/fr-CA`);
    await expect(page).toHaveURL(`${siteUrl}/fr-CA`);
  });

  test(`URL prefix takes precedence over Accept-Language header`, async () => {
    const { page } = await createPageWithAcceptLanguage("en-GB");
    await page.goto(`${siteUrl}/fr-CA`);
    await expect(page).toHaveURL(`${siteUrl}/fr-CA`);
  });
});
