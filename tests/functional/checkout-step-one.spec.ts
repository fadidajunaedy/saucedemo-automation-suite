import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutStepOnePage } from "../../pages/CheckoutStepOnePage";

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

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toContainText('Checkout');
});

test('User should be able to cancel checkout', async ({ page }) => {
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.cancelCheckout();

  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
});

test('User should be able to proceed to checkout', async ({ page }) => {
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.proceedToCheckout('fadida', 'junaedy', "13740");

  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');
});
