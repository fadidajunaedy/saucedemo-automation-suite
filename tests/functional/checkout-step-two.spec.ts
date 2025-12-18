import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutStepOnePage } from "../../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../../pages/CheckoutStepTwoPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.proceedToCheckout('fadida', 'junaedy', "13740");
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
});

test('User should be able to cancel checkout', async ({ page }) => {
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  await checkoutStepTwoPage.cancelCheckout();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('User should be able to finish to checkout', async ({ page }) => {
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const subTotal: number = await checkoutStepTwoPage.getSubTotal();
  const tax: number = await checkoutStepTwoPage.getTax();
  const total:number = await checkoutStepTwoPage.getTotal();
  expect(subTotal + tax).toEqual(total);

  await checkoutStepTwoPage.finishCheckout();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
});
