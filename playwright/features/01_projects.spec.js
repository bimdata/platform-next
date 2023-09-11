const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/spaces");
  await page.getByTestId("space-card").click();
});

test.describe("Project", () => {
  test("create/update/delete project", async ({ page }) => {
    // Create project
    await page.getByTestId("btn-open-create").click();
    await page
      .locator("input[data-testid=input-create-name]")
      .fill("Test Project");
    await page.getByTestId("btn-submit-create").click();

    const card = await page
      .getByTestId("project-card")
      .filter({ hasText: "Test Project" });

    await expect(card).toHaveCount(1);
  });

  test("rename project", async ({ page }) => {
    const card = await page
      .getByTestId("project-card")
      .filter({ hasText: "Test Project" });

    await card.getByTestId("btn-open-menu").click();
    await card.getByTestId("btn-open-update").click();
    await card
      .locator("input[data-testid=input-update-name]")
      .fill("New Project Name");
    await card.getByTestId("btn-submit-update").click();

    const updatedCard = await page
      .getByTestId("project-card")
      .filter({ hasText: "New Project Name" });

    await expect(card).toHaveCount(0);
    await expect(updatedCard).toHaveCount(1);
  });

  test("delete project", async ({ page }) => {
    const card = await page
      .getByTestId("project-card")
      .filter({ hasText: "New Project Name" });

    await card.getByTestId("btn-open-menu").click();
    await card.getByTestId("btn-open-delete").click();
    await card.getByTestId("btn-submit-delete").click();

    await expect(card).toHaveCount(0);
  });
});
