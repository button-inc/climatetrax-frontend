import { test, expect, chromium } from '@playwright/test';

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
    locale: 'fr-CA', // setting French Canadian as the default language
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:3000//');

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*fr-CA/);

  //await browser.close();
});


