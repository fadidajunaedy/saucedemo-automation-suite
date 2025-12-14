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
});

test('E2E: User should be able completed a pucshase flow with single item', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
  expect(page.locator('.cart-item')).toBeDefined();

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.proceedToCheckout('fadida', 'junaedy', "13740");
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');

  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const subTotal: number = await checkoutStepTwoPage.getSubTotal();
  const tax: number = await checkoutStepTwoPage.getTax();
  const total: number = await checkoutStepTwoPage.getTotal();
  expect(subTotal + tax).toEqual(total);

  await checkoutStepTwoPage.finishCheckout();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
})

test('E2E: User should be able completed a pucshase flow with multiple item', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');

  await inventoryPage.addItemToCart('Sauce Labs Bike Light');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('2');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
  expect(page.locator('.cart-item')).toBeDefined();

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.proceedToCheckout('fadida', 'junaedy', "13740");
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');

  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const rawPriceArray: string[] = await page.locator('.inventory_item_price').allTextContents();
  const cleanPriceArray: number[] = rawPriceArray.map(price => parseFloat(price.replace('$', '')));
  const totalPrice: number = cleanPriceArray.reduce((acc, current) => acc + current, 0);
  const subTotal: number = await checkoutStepTwoPage.getSubTotal();
  const tax: number = await checkoutStepTwoPage.getTax();
  const total: number = await checkoutStepTwoPage.getTotal();
  expect(totalPrice).toEqual(subTotal);
  expect(subTotal + tax).toEqual(total);

  await checkoutStepTwoPage.finishCheckout();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});

test('E2E: User should not be able to checkout if not fill checkout information', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
  expect(page.locator('.cart-item')).toBeDefined();

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.clickingContinueButton();
  expect(page.locator("[data-test='error']")).toHaveText('Error: First Name is required');

  await checkoutStepOnePage.enterFirstName('fadida');
  await checkoutStepOnePage.clickingContinueButton();
  expect(page.locator("[data-test='error']")).toHaveText('Error: Last Name is required');

  await checkoutStepOnePage.enterLastName('junaedy');
  await checkoutStepOnePage.clickingContinueButton();
  expect(page.locator("[data-test='error']")).toHaveText('Error: Postal Code is required');
});

test('E2E: User should be able to cancel checkout in last minute', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.navbar.cartBadge).toHaveText('1');

  await inventoryPage.navbar.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
  expect(page.locator('.cart-item')).toBeDefined();

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.proceedToCheckout('fadida', 'junaedy', "13740");
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');

  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  await checkoutStepTwoPage.cancelCheckout();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});
