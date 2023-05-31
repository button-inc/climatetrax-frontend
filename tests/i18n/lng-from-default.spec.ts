import { test, expect, chromium } from '@playwright/test';
import { fallbackLng } from "../../app/i18n/settings";
import { EN_WELCOME_MSG, FR_WELCOME_MSG, enUrls, frUrls, lngs, siteUrl } from './testUtils';

/*
Verify that the server responds with the correct Content-Language header 
in the HTTP response based on the requested page's determined language.
*/
for (const lng of lngs) {
  test(`Server should respond with correct Content-Language: ${lng}`, async () => {
    // Launch browser
    const browser = await chromium.launch();

    // Create a new context
    const context = await browser.newContext();

    // Create a new page in this context
    const page = await context.newPage();

    // Navigate to the page with the current language prefix
    await page.goto(`${siteUrl}/${lng}`);

    // Fetch the same URL to verify the response headers
    const response = await page.goto(`${siteUrl}/${lng}`);
    
    // Expect Content-Language header to match the requested language
    expect(response?.headers()['content-language']).toBe(lng);

    // Close the browser at the end of the test
    await browser.close();
  });
}

/*
This test case verifies that even if there is an i18next cookie 
with a language value set, accessing a URL with a different language prefix should 
display the content in the language of the URL prefix.
*/
test(`URL prefix takes precedence over i18next cookie value`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context
  const context = await browser.newContext();

  // Create a new page in this context
  const page = await context.newPage();

  // Set 'i18next' cookie to 'en-GB'
  await context.addCookies([{
    name: 'i18next',
    value: 'en-GB',
    url: siteUrl,
  }]);

  // Navigate to the page with language prefix 'fr-CA'
  await page.goto(`${siteUrl}/fr-CA`);

  // Expect URL to stay as '/fr-CA/' indicating that French Canadian language is being used
  await expect(page).toHaveURL(`${siteUrl}/fr-CA`);

  // Close the browser at the end of the test
  await browser.close();
});

/*
This test case verifies that even if the Accept-Language header in
 the request is set to a specific language, accessing 
 a URL with a different language prefix should display the content in the language of the URL prefix.
 */
test(`URL prefix takes precedence over Accept-Language header`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Create a new context with the Accept-Language header set to 'en-GB'
  const context = await browser.newContext({
    locale: 'en-GB'
  });

  // Create a new page in this context
  const page = await context.newPage();

  // Navigate to the page with language prefix 'fr-CA'
  await page.goto(`${siteUrl}/fr-CA`);

  // Expect URL to stay as '/fr-CA/' indicating that French Canadian language is being used
  await expect(page).toHaveURL(`${siteUrl}/fr-CA`);

  // Close the browser at the end of the test
  await browser.close();
});










