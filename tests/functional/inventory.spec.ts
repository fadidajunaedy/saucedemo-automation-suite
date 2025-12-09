import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('User should be able to add item to cart', async({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart("Sauce Labs Backpack");

  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('User should be able to click item', async({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goToDetailItem("Sauce Labs Backpack");

  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.locator('.inventory_details_name')).toHaveText("Sauce Labs Backpack");
});

test('User should be able to sort items by Name (A to Z)', async ({ page }) => {

});

test('User should be able to sort items by Name (Z to A)', async ({ page }) => {

});

test('User should be able to sort items by Price (low to high)', async ({ page }) => {

});

test('User should be able to sort items by Price (high to low)', async ({ page }) => {

});
