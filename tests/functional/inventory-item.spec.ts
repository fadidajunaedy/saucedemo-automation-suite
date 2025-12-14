import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { InventoryItemPage } from "../../pages/InventoryItemPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  const inventoryPage = new InventoryPage(page);
  const itemName = 'Sauce Labs Backpack';
  await inventoryPage.goToDetailItem(itemName);
  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.locator('.inventory_details_name')).toHaveText(itemName);
});

test('User should be able to add item to cart', async ({ page }) => {
  const inventoryItemPage = new InventoryItemPage(page);
  await inventoryItemPage.addItemToCart();
  await expect(inventoryItemPage.navbar.cartBadge).toHaveText('1');
});

test('User should be able to remove item from cart', async ({ page }) => {
  const inventoryItemPage = new InventoryItemPage(page);
  await inventoryItemPage.addItemToCart();
  await expect(inventoryItemPage.navbar.cartBadge).toHaveText('1');

  await inventoryItemPage.removeItemFromCart();
  await expect(inventoryItemPage.navbar.cartBadge).toBeHidden();
});

test('User should be able to back to inventory page item', async ({ page }) => {
  const inventoryItemPage = new InventoryItemPage(page);
  await inventoryItemPage.backButton.click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});
