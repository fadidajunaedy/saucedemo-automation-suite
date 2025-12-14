import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test('User should be able login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('User should not be able login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await expect(page.locator('[data-test="error"]')).toBeHidden();

  await loginPage.login('random_user', 'random_password');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user in this service');
});


