const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080/spaces");
  await page.getByTestId("space-card").click();
  await page.getByTestId("project-card").click();
  await page.getByTestId("project-tab-overview").click();
});

test.describe("Models", () => {
  test("upload model", async ({ page }) => {
    // TODO
  });
});
