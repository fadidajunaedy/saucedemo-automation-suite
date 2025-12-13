import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await inventoryPage.navbar.goToCart();

  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
  await expect(page.locator('.cart-item')).toBeDefined();
});

test('User should be able to remove item to cart', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.removeItemFromCart('Sauce Labs Backpack');
  await expect(page.locator('.cart-item')).toBeHidden();
});

test('User should be able to continue shopping', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.continueShopping();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('User should be able to proceed to checkout', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toContainText('Checkout');
});
