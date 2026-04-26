const { expect, test } = require("@playwright/test");
const { mkdir } = require("node:fs/promises");
const path = require("node:path");

const authDir = path.join(__dirname, "..", ".playwright");
const authFile = path.join(authDir, "auth-state.json");

test("bootstrap authenticated storage state", async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);
  test.skip(
    process.env.PLAYWRIGHT_AUTH_SETUP !== "1",
    "Set PLAYWRIGHT_AUTH_SETUP=1 and run this project headed to create auth-state.json."
  );

  await mkdir(authDir, { recursive: true });
  await page.goto("/en/signin", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Sign in as Dev User" }).click();
  await page.waitForURL("**/en", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  await page.evaluate(() => {
    document.cookie = "NEXT_LOCALE=en;path=/;max-age=31536000";
  });

  await page.context().storageState({ path: authFile });
});
