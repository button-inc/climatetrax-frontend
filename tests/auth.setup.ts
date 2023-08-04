import { test as setup, chromium } from "@playwright/test";
const dotenv = require("dotenv");
dotenv.config({
  path: "./tests/.env",
});

const siteUrl = process.env.API_HOST as string;
const authFile = "playwright/.auth/user.json";
// 👇️ hard-coded JWT obtained from app/utils/postgraphile/helpers.tsx-possibly explore jsonwebtoken to encrypt a JSON mock response
const jwt = process.env.NEXTAUTH_JWT_ANALYST as string;

// 👇️ setup function defines a test case that will run before all other test cases within the test
setup("authenticate", async () => {
  // 👇️ set up a Playwright browser instance:
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 👇️ navigate to the page where the session token needs to be mocked
  await page.goto(`${siteUrl}`);

  // 👇️ add token as next-auth cookie
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: jwt,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
    },
  ]);

  // 👇️  store the browser's signed state in the specified file path
  // ❗ this allows you to persist the authentication state between tests or test runs
  await context.storageState({ path: authFile });
  await browser.close();
});

/*
  // 👇️ Google/MS authentication...
  await page.locator('button[data-myprovider="Google"]').click();
  // click redirects page to Google auth form
  await page.fill('input[type="email"]', email);
  await page.getByRole("button", { name: "Next" }).click();
  // with @button.is email, click redirects page to MicroSoft auth form
  await page.fill('input[type="email"]', email);
  await page.getByRole("button", { name: "Next" }).click();
  await page.locator("#i0118").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  // ❗ Navigation failed...
   await page.waitForURL(`${siteUrl}/en/analyst/home`);



  // 👇️ mock JSON user session...
 const mockSession = {
    user: {
      id: "user-id",
      name: name,
      email: email,
      role: role,
    },
  };

    // Encrypt the mock response
  const jwt = jwt.sign(mockResponse, secret);
*/
