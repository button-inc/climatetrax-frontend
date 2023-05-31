import { test, expect, chromium } from '@playwright/test';
import { fallbackLng } from "../../app/i18n/settings";
import { lngs, siteUrl } from './testUtils';

const cookieName = "i18next";

for (const lng of lngs) {
  test(`Check that accessing URL with ${lng} prefix 
  sets the i18next language preference cookie`, async ({ page }) => {
    // Go to the page with language prefix
    await page.goto(`${siteUrl}/${lng}`);
  
    // Get cookies
    const cookies = await page.context().cookies();

    // Find i18next cookie
    const i18nCookie = cookies.find(cookie => cookie.name === 'i18next');

    // Assert that the cookie exists and its value matches the language prefix
    expect(i18nCookie).toBeTruthy();
    expect(i18nCookie?.value).toBe(lng);
  });
}


for (const lng of lngs) {
  test(`Ensure i18next language preference cookie is set and 
  verify that a URL, without language prefix, 
  displays content in the i18next language preference: ${lng}`, async ({ page }) => {
    // Set i18next cookie
    await page.context().addCookies([{
      name: 'i18next',
      value: lng,
      url: siteUrl,
    }]);
    
    // Navigate to the page without language prefix
    await page.goto(siteUrl);
    
    // Check that the page URL matches the expected language URL
    expect(page.url()).toContain(`/${lng}`);

    // Get cookies
    const cookies = await page.context().cookies();
    // Find i18next cookie
    const i18nCookie = cookies.find(cookie => cookie.name === 'i18next');

    // Assert that the cookie exists and its value matches the language
    expect(i18nCookie).toBeTruthy();
    expect(i18nCookie?.value).toBe(lng);
  });
}

for (const lng of lngs) {
  test(`Clear the cookie and 
  ensure that a url, without language prefix, 
  sets the i18next language preference cookie to 
  the value of the Accept-Language header default language: ${lng}`, async () => {
    // Launch browser
    const browser = await chromium.launch();

    // Create a new context with the Accept-Language header set to the current language
    const context = await browser.newContext({
      locale: lng
    });

    // Create a new page in this context
    const page = await context.newPage();

    // Navigate to the page without language prefix
    await page.goto(siteUrl);

    // Get cookies
    const cookies = await context.cookies();
    // Find i18next cookie
    const i18nCookie = cookies.find(cookie => cookie.name === 'i18next');

    // Assert that the cookie exists and its value matches the language
    expect(i18nCookie).toBeTruthy();
    expect(i18nCookie?.value).toBe(lng);

    // Close the browser at the end of the test
    await browser.close();
  });
}

test(`Clear the cookie and 
ensure that a url, without language prefix, 
sets the i18next language preference cookie to 
the value of the i18next default language when 
the Accept-Language header is NOT available or NOT supported`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context with the Accept-Language header set to a non-supported language
  const context = await browser.newContext({
    locale: 'zh-CN' // Chinese, which is not supported by our i18next languages
  });

  // Create a new page in this context
  const page = await context.newPage();

  // Navigate to the page without language prefix
  await page.goto(siteUrl);

  // Get cookies
  const cookies = await context.cookies();
  // Find i18next cookie
  const i18nCookie = cookies.find(cookie => cookie.name === 'i18next');

  // Assert that the cookie exists and its value matches the fallback language
  expect(i18nCookie).toBeTruthy();
  expect(i18nCookie?.value).toBe(fallbackLng); 

  // Close the browser at the end of the test
  await browser.close();
});

test(`Missing i18next cookie should use Accept-Language header`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context with the Accept-Language header set to 'fr-CA'
  const context = await browser.newContext({
    locale: 'fr-CA'
  });

  // Create a new page in this context
  const page = await context.newPage();

  // Navigate to the page without language prefix
  await page.goto(siteUrl);

  // Expect URL to have '/fr-CA/' indicating redirection to French Canadian language
  await expect(page).toHaveURL(/.*fr-CA/);

  // Close the browser at the end of the test
  await browser.close();
});

test(`Invalid i18next cookie should use Accept-Language header`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context with the Accept-Language header set to 'fr-CA'
  const context = await browser.newContext({
    locale: 'fr-CA'
  });

  // Create a new page in this context
  const page = await context.newPage();

  // Set invalid 'i18next' cookie
  await context.addCookies([{
    name: cookieName,
    value: 'unsupported-language',
    url: siteUrl,
  }]); 

  // Navigate to the page without language prefix
  await page.goto(siteUrl);

  // Expect URL to have '/fr-CA/' indicating redirection to French Canadian language
  await expect(page).toHaveURL(/.*fr-CA/);

  // Close the browser at the end of the test
  await browser.close();
});

test(`Conflict between i18next cookie and Accept-Language header should prioritize i18next cookie`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context with the Accept-Language header set to 'fr-CA'
  const context = await browser.newContext({
    locale: 'fr-CA'
  });

  // Create a new page in this context
  const page = await context.newPage();

  // Set 'i18next' cookie to 'en'
  await context.addCookies([{
    name: cookieName,
    value: 'en',
    url: siteUrl,
  }]);

  // Navigate to the page without language prefix
  await page.goto(siteUrl);

  // Expect URL to have '/en/' indicating redirection to English language
  await expect(page).toHaveURL(/.*en/);

  // Close the browser at the end of the test
  await browser.close();
});