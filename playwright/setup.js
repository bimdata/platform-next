const { test: setup, expect } = require("@playwright/test");

const STORAGE_STATE = ".auth/user.json";

setup("setup", async ({ page }) => {
  await page.goto("/");

  // Fill login form
  await page.locator('input[name="email"]').fill("playwright+test@bimdata.io");
  await page.locator('input[name="password"]').fill("1234test");

  // Submit
  await page.getByRole("button", { name: "Log In" }).click();

  // Assert that we have successfully logged in
  await expect(page).toHaveURL("http://localhost:8080");

  // Save storage state
  await page.context().storageState({ path: STORAGE_STATE });
});
