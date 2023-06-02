import { test, expect, chromium, Browser, BrowserContext, Page } from "@playwright/test";
import { fallbackLng } from "../../app/i18n/settings";
import {
  EN_WELCOME_MSG,
  FR_WELCOME_MSG,
  enUrls,
  frUrls,
  siteUrl,
} from "./testUtils";

async function createPageWithAcceptLanguage(locale: string = ''): Promise<{ browser: Browser; context: BrowserContext; page: Page; }> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: locale });
  const page = await context.newPage();
  return { browser, context, page };
}

test.describe("URL Prefix Language Redirection", () => {
  let browser: Browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should redirect to the i18next default language when Accept-Language is not available or unsupported", async () => {
    const { page } = await createPageWithAcceptLanguage('unsupported-locale');
    await page.goto(siteUrl);
    expect(page.url()).toContain(`${siteUrl}/${fallbackLng}`);
  });

  for (const url of enUrls) {
    test(`should contain the correct message for English at ${url}`, async ({ page }) => {
      await page.goto(url);
      const pageContent = await page.textContent("body");
      expect(pageContent).toContain(EN_WELCOME_MSG);
    });
  }

  for (const url of frUrls) {
    test(`should contain the correct message for French at ${url}`, async ({ page }) => {
      await page.goto(url);
      const pageContent = await page.textContent("body");
      expect(pageContent).toContain(FR_WELCOME_MSG);
    });
  }

  test(`Unsupported language prefix defaults to Accept-Language header value`, async () => {
    const { page } = await createPageWithAcceptLanguage('fr-CA');
    await page.goto(`${siteUrl}/unsupported-lng/`);
    await expect(page).toHaveURL(/.*fr-CA/);
  });

  test(`Unsupported language prefix defaults to i18next default language`, async () => {
    const { page } = await createPageWithAcceptLanguage('unsupported-locale');
    await page.goto(`${siteUrl}/unsupported-lng/`);
    expect(page.url()).toContain(`${siteUrl}/${fallbackLng}`);
  });
});