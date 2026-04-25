const { expect, test } = require("@playwright/test");

test.describe.configure({ mode: "serial" });

const ids = {
  currentTripId: "trip-current-barcelona",
  upcomingTripId: "trip-upcoming-tokyo",
  uncoveredTripId: "trip-upcoming-lisbon",
  pastTripId: "trip-past-toronto",
  activeVisaId: "visa-active-schengen",
  expiringVisaId: "visa-expiring-japan",
  expiredVisaId: "visa-expired-canada",
};

const pickToday = async (page, labelText) => {
  await page
    .locator("label")
    .filter({ hasText: labelText })
    .locator("button")
    .click();
  await page
    .locator("button")
    .filter({ hasText: /^(TODAY|AUJOURD'HUI)$/i })
    .click();
};

test("dashboard renders the seeded non-empty state", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Trips|Voyages/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /CURRENTLY IN LIVE 🇪🇸 Barcelona sprint/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /NEXT TRIP 14 DAYS UNTIL DEPARTURE Tokyo cherry blossom/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /09 MAY 🇯🇵 Tokyo cherry blossom/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /02 MAR 🇨🇦 Toronto retrospective/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /No visa linked|Aucun visa lié/i })
  ).toBeVisible();
});

test("visas list shows seeded ordering and tones", async ({ page }) => {
  await page.goto("/visas");

  const rows = page
    .locator('main a[href^="/visas/"]')
    .filter({ hasNotText: "Add visa" });
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText("Schengen Explorer");
  await expect(rows.nth(0)).toContainText("valid");
  await expect(rows.nth(1)).toContainText("Japan Fast Track");
  await expect(rows.nth(1)).toContainText("expiring");
  await expect(rows.nth(2)).toContainText("Canada Visitor Archive");
  await expect(rows.nth(2)).toContainText("expired");
});

test("trip detail shows the selected visa and coverage hierarchy", async ({
  page,
}) => {
  await page.goto(`/trips/${ids.currentTripId}`);

  await expect(
    page.getByText("Barcelona sprint", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("Schengen Explorer covers this trip.")
  ).toBeVisible();
  await expect(page.getByText("Selected visa")).toBeVisible();
  await expect(page.getByText("Visa options")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Edit trip/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Delete trip/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Schengen Explorer/ })
  ).toBeVisible();
});

test("trip edit page opens with the current trip data", async ({ page }) => {
  await page.goto(`/trips/${ids.currentTripId}/edit`);

  await expect(page.getByText("Edit trip")).toBeVisible();
  await expect(page.getByLabel(/Trip name|Nom du voyage/i)).toHaveValue(
    "Barcelona sprint"
  );
  await expect(
    page.getByRole("button", { name: /Continue|Continuer/i })
  ).toBeVisible();
});

test("visa detail shows projection, trips, and coverage", async ({ page }) => {
  await page.goto(`/visas/${ids.activeVisaId}`);

  await expect(
    page.getByText("Schengen Explorer", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("Validity")).toBeVisible();
  await expect(page.getByText("Projection")).toBeVisible();
  await expect(page.getByText("Usage", { exact: true })).toBeVisible();
  await expect(page.getByText("Trips", { exact: true })).toBeVisible();
  await expect(page.getByText("Coverage", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Barcelona sprint", { exact: true })
  ).toBeVisible();
});

test("settings shows account and preference controls", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByText("Account")).toBeVisible();
  await expect(page.getByText("Appearance")).toBeVisible();
  await expect(page.getByText("Language")).toBeVisible();
  await expect(page.getByRole("link", { name: "Trips" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign out/i })).toBeVisible();
});

test("trip create flow creates a trip and returns to the dashboard", async ({
  page,
}) => {
  await page.goto("/trips/create");

  await expect(page.getByText("Recently visited")).toBeVisible();
  await expect(page.getByText("Most visited")).toBeVisible();
  await expect(page.getByRole("button", { name: /Canada/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /France/i })).toBeVisible();

  await page
    .getByPlaceholder(/Search country|Rechercher un pays/i)
    .fill("France");
  await page.getByRole("button", { name: /France/ }).click();
  await page.getByRole("button", { name: /Continue|Continuer/i }).click();

  await page.getByLabel(/Trip name|Nom du voyage/i).fill("Paris review");
  await pickToday(page, /Start date|Date de départ/i);
  await pickToday(page, /End date|Date de retour/i);
  await page.getByRole("button", { name: /Continue|Continuer/i }).click();
  await page
    .getByRole("button", { name: /Create trip|Créer le voyage/i })
    .click();

  await page.waitForURL("/");
  await expect(
    page.getByRole("link", { name: /Paris review/i }).first()
  ).toBeVisible();
});

test("visa create flow creates a visa and returns to the visas list", async ({
  page,
}) => {
  await page.goto("/visas/create");

  await page.getByRole("button", { name: /ESTA/ }).click();
  await page.getByRole("button", { name: /Continue|Continuer/i }).click();

  await page.getByLabel(/Visa name|Nom du visa/i).fill("US Travel Test");
  await page.getByRole("button", { name: /Continue|Continuer/i }).click();
  await page.getByRole("button", { name: /Continue|Continuer/i }).click();

  await page
    .locator("label")
    .filter({ hasText: /Valid from|Valide à partir du/i })
    .locator("button")
    .click();
  await page
    .locator("button")
    .filter({ hasText: /^(TODAY|AUJOURD'HUI)$/i })
    .click();
  await page
    .getByRole("button", { name: /Create visa|Créer le visa/i })
    .click();

  await page.waitForURL("/visas");
  await expect(page.getByText("US Travel Test")).toBeVisible();
});
