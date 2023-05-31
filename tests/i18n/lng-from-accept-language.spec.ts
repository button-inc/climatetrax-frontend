import { test, expect, chromium } from '@playwright/test';
import { fallbackLng } from "../../app/i18n/settings";
import { lngs, siteUrl } from './testUtils';


/*
each language in the languages array. 
It will simulate an Accept-Language header for each language, and 
check whether the page URL contains the language prefix, indicating that it was correctly redirected.
*/
for (const lng of lngs) {
  test(`Page should display content in language: ${lng}`, async () => {
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

    // Expect URL to have '/[lang]/' indicating redirection to the correct language
    await expect(page).toHaveURL(new RegExp(`.*/${lng}/?`));

    // Close the browser at the end of the test
    await browser.close();
  });
}

/*
Simulate different Accept-Language headers in the HTTP request and 
ensure that the  content displays in the highest-priority language according to the header.
*/
test('Set French Canadian as the highest-priority language', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'fr-CA,en-US' // Set French Canadian as highest priority in Accept-Language, then US English
  });
  const page = await context.newPage();

  await page.goto(siteUrl);
  await expect(page).toHaveURL(/.*fr-CA/);  // Expect to be redirected to French Canadian version

  await browser.close();
});

// Test for US English language
test('Set US English as the highest-priority language', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'en-US,fr-CA' // Set US English as highest priority in Accept-Language, then French Canadian
  });
  const page = await context.newPage();

  await page.goto(siteUrl);
  await expect(page).toHaveURL(/.*en-US/);  // Expect to be redirected to US English version

  await browser.close();
});

/*
how the application handles multiple language options in the Accept-Language header, 
which can be given in the format 'lang;q=value', 
where 'q' is a quality factor that specifies the user's preference. 
The range for 'q' is 0 to 1, with 1 being the most preferred language.
*/
test(`Page should display content in highest priority language from Accept-Language header`, async () => {
  // Launch browser
  const browser = await chromium.launch();

  // Define Accept-Language header with multiple languages
  const acceptLanguages = 'en;q=0.1, en-CA;q=0.2, en-GB;q=0.3, en-US;q=0.4, fr;q=0.5, fr-CA;q=1.0';

  // Create a new context with the Accept-Language header set to the current language option
  const context = await browser.newContext({
    locale: acceptLanguages
    }
  );

  // Create a new page in this context
  const page = await context.newPage();

  // Navigate to the page without language prefix
  await page.goto(siteUrl);

  // The language with highest priority in the Accept-Language header with q of 1.0
  const highestPriorityLanguage = 'fr-CA';

  // Expect URL to have '/[highestPriorityLanguage]' (with an optional trailing slash) indicating redirection to the highest priority language
  await expect(page).toHaveURL(new RegExp(`.*/${highestPriorityLanguage}/?`));

  // Close the browser at the end of the test
  // await browser.close();
});
