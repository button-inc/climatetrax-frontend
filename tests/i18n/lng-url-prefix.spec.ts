import { test, expect, chromium } from '@playwright/test';
import { fallbackLng } from "../../app/i18n/settings";

const siteUrl = 'http://localhost:3000';

/*
Ensure that URLs without a language prefix redirects to 
the Accept-Language header default language, 
if available and if supported by our i18next languages.
*/
test('should redirect to the default language based on Accept-Language header', async () => {
  const browser = await chromium.launch();
  /*
  The Playwright newContext method allows setting a locale, 
  which will be sent as the Accept-Language HTTP header in the requests.
  */
  const context = await browser.newContext({
    locale: 'fr-CA', // setting French Canadian as the default language Accept-Language
  });
  
  const page = await context.newPage();
  await page.goto(siteUrl);

  await expect(page).toHaveURL(/.*fr-CA/);

  //await browser.close();
});

/*
Ensure that URLs without a language prefix redirects to the i18next default language when 
the Accept-Language header is NOT available or NOT supported by our i18next languages.
*/
test('should redirect to the i18next default language when Accept-Language is not available or unsupported', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'unsupported-locale', // set to an unsupported language locale
  });

  const page = await context.newPage();
  await page.goto(siteUrl); 

  // Check if the URL now includes the i18next default language prefix after redirection
  expect(page.url()).toContain(siteUrl + "/" + fallbackLng);

});


/*
Verify that accessing URLs with different supported language prefixes 
(e.g., /en/, /en-CA/, /en-GB/, en-US/,/fr/, /fr-CA/) 
displays the corresponding content in the respective language.
*/
const EN_WELCOME_MSG = 'Welcome! This is a fallback message common to all en languages';
const FR_WELCOME_MSG = 'FR Welcome! This is a fallback message common to all fr languages';

[ siteUrl + "/en/",
  siteUrl + "/en-CA/",
  siteUrl + "/en-GB/",
  siteUrl + "/en-US/"
].forEach(url => {
  test(`should contain the correct message for English at ${url}`, async ({ page }) => {
    await page.goto(url);
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain(EN_WELCOME_MSG);
  });
});

[ siteUrl + "/fr/",
  siteUrl + "/fr-CA/"
].forEach(url => {
  test(`should contain the correct message for French at ${url}`, async ({ page }) => {
    await page.goto(url);
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain(FR_WELCOME_MSG);
  });
});

/*Test different scenarios of invalid or unsupported language prefixes 
displays content based on i18next or supported Accept-Language Header value, 
or i18next default language. */
test(`Unsupported language prefix defaults to Accept-Language header value`, async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'fr-CA', 
  });
  
  const page = await context.newPage();

  await page.goto(siteUrl + '/unsupported-lng/');
  await expect(page).toHaveURL(/.*fr-CA/);
});

test(`Unsupported language prefix defaults to i18next default language`, async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'unsupported-locale', 
  });
  
  const page = await context.newPage();

  await page.goto(siteUrl + '/unsupported-lng/');
  expect(page.url()).toContain(siteUrl + "/" + fallbackLng);
});










