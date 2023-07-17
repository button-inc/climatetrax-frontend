import { chromium, Browser, BrowserContext, Page } from "@playwright/test";

export const siteUrl = 'http://localhost:3000';

export const EN_WELCOME_MSG = 'Welcome! This is a fallback message common to all en languages';
export const FR_WELCOME_MSG = 'FR Welcome! This is a fallback message common to all fr languages';

export const enLngs = ['en', 'en-CA', 'en-GB', 'en-US', ];
export const frLngs = ['fr', 'fr-CA'];
export const lngs = enLngs.concat(frLngs);

export const enUrls = [
  siteUrl + "/en/",
  siteUrl + "/en-CA/",
  siteUrl + "/en-GB/",
  siteUrl + "/en-US/"
  ]
export const frUrls = [
  siteUrl + "/fr/",
  siteUrl + "/fr-CA/"
]

export async function createPageWithAcceptLanguage(locale: string = ''): Promise<{ browser: Browser; context: BrowserContext; page: Page; }> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale });
  const page = await context.newPage();
  return { browser, context, page };
}
