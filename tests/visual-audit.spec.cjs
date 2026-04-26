const { test, expect } = require("@playwright/test");

test.describe("Visual Audit", () => {
  test("dashboard screenshot", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/dashboard-audit.png",
      fullPage: false,
    });
  });

  test("visas list screenshot", async ({ page }) => {
    await page.goto("/en/visas");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/visas-list-audit.png",
      fullPage: false,
    });
  });

  test("settings screenshot", async ({ page }) => {
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/settings-audit.png",
      fullPage: false,
    });
  });

  test("design system screenshot", async ({ page }) => {
    await page.goto("/en/design-system");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/design-system-audit.png",
      fullPage: false,
    });
  });
});
