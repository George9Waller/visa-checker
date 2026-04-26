const { test } = require("@playwright/test");
const path = require("node:path");

const authFile = path.join(__dirname, "..", ".playwright", "auth-state.json");

test.describe("Detail Page Screenshots", () => {
  test.use({
    storageState: authFile,
    baseURL: "http://localhost:3000",
  });

  test("trip detail screenshot", async ({ page }) => {
    await page.goto("/trips/trip-current-barcelona");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/trip-detail-audit.png",
      fullPage: false,
    });
  });

  test("visa detail screenshot", async ({ page }) => {
    await page.goto("/visas/visa-active-schengen");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/visa-detail-audit.png",
      fullPage: false,
    });
  });
});
