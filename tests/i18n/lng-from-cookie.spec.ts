import { test, expect, chromium, BrowserContext, Page } from "@playwright/test";
import { fallbackLng } from "../../../app/i18n/settings";
import { lngs, siteUrl } from "./testUtils";

const cookieName = "i18next";

test.describe("Server Language Response Tests", () => {
  let context: BrowserContext;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    context = await browser.newContext();
  });

  test.afterAll(async () => {
    await context.close();
  });

  const testCases = [
    {
      description:
        "Check that accessing URL with language prefix sets the i18next language preference cookie",
      testFn: async (page: Page, lng: string) => {
        await page.goto(`${siteUrl}/${lng}`);
        const cookies = await page.context().cookies();
        const i18nCookie = cookies.find((cookie) => cookie.name === cookieName);
        expect(i18nCookie).toBeTruthy();
        expect(i18nCookie?.value).toBe(lng);
      },
    },
    {
      description:
        "Ensure i18next language preference cookie is set and verify that a URL, without language prefix, displays content in the i18next language preference",
      testFn: async (page: Page, lng: string) => {
        await page.context().addCookies([
          {
            name: cookieName,
            value: lng,
            url: siteUrl,
          },
        ]);
        await page.goto(siteUrl);
        expect(page.url()).toContain(`/${lng}`);
        const cookies = await page.context().cookies();
        const i18nCookie = cookies.find((cookie) => cookie.name === cookieName);
        expect(i18nCookie).toBeTruthy();
        expect(i18nCookie?.value).toBe(lng);
      },
    },
    {
      description:
        "Clear the cookie and ensure that a URL, without language prefix, sets the i18next language preference cookie to the value of the Accept-Language header default language",
      testFn: async (page: Page, lng: string) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({
          locale: lng,
        });
        page = await context.newPage();
        await page.goto(siteUrl);
        const cookies = await context.cookies();
        const i18nCookie = cookies.find((cookie) => cookie.name === cookieName);
        expect(i18nCookie).toBeTruthy();
        expect(i18nCookie?.value).toBe(lng);
        await browser.close();
      },
    },
  ];

  testCases.forEach(({ description, testFn }) => {
    lngs.forEach((lng) => {
      test(description + `: ${lng}`, async ({ page }) => {
        await testFn(page, lng);
      });
    });
  });

  test(`Clear the cookie and ensure that a url, without language prefix, sets the i18next language preference cookie to the value of the i18next default language when the Accept-Language header is NOT available or NOT supported`, async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      locale: "zh-CN",
    });
    const page = await context.newPage();
    await page.goto(siteUrl);
    const cookies = await context.cookies();
    const i18nCookie = cookies.find((cookie) => cookie.name === cookieName);
    expect(i18nCookie).toBeTruthy();
    expect(i18nCookie?.value).toBe(fallbackLng);
    await browser.close();
  });

  test(`Missing i18next cookie should use Accept-Language header`, async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      locale: "fr-CA",
    });
    const page = await context.newPage();
    await page.goto(siteUrl);
    await expect(page).toHaveURL(/.*fr-CA/);
    await browser.close();
  });

  test(`Invalid i18next cookie should use Accept-Language header`, async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      locale: "fr-CA",
    });
    const page = await context.newPage();
    await context.addCookies([
      {
        name: cookieName,
        value: "unsupported-language",
        url: siteUrl,
      },
    ]);
    await page.goto(siteUrl);
    await expect(page).toHaveURL(/.*fr-CA/);
    await browser.close();
  });

  test(`Conflict between i18next cookie and Accept-Language header should prioritize i18next cookie`, async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      locale: "fr-CA",
    });
    const page = await context.newPage();
    await context.addCookies([
      {
        name: cookieName,
        value: "en-GB",
        url: siteUrl,
      },
    ]);
    await page.goto(siteUrl);
    await expect(page).toHaveURL(/.*en-GB/);
    await browser.close();
  });
});
