import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { InventoryItemPage } from "../../pages/InventoryItemPage";

test.beforeEach(async ({ page }) => {
  const loginPage: LoginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
});

test('E2E: User should be able to update cart state (add and remove items) correctly', async ({ page }) => {
  const inventoryPage: InventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await inventoryPage.addItemToCart('Sauce Labs Bike Light');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('2');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');

  const cartPage: CartPage = new CartPage(page);
  await cartPage.removeItemFromCart('Sauce Labs Bike Light');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');
});

test('E2E: User should be able to add an item to the cart from the product detail page', async ({ page }) => {
  const inventoryPage: InventoryPage = new InventoryPage(page);
  await inventoryPage.goToDetailItem('Sauce Labs Backpack');
  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.locator('.inventory_details_name')).toHaveText("Sauce Labs Backpack");

  const inventoryItemPage: InventoryItemPage = new InventoryItemPage(page);
  await inventoryItemPage.addItemToCart();
  await inventoryItemPage.backToInventory();
  await expect(inventoryItemPage.navbar.cartBadge).toHaveText('1');
});

test('E2E: Cart content should remain persistent when navigating back to shopping', async ({ page }) => {
  const inventoryPage: InventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

  const cartPage: CartPage = new CartPage(page);
  await cartPage.continueShopping();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  await inventoryPage.goToDetailItem('Sauce Labs Bike Light');
  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.locator('.inventory_details_name')).toHaveText("Sauce Labs Bike Light");

  const inventoryItemPage: InventoryItemPage = new InventoryItemPage(page);
  await inventoryItemPage.navbar.goToCart();
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});
