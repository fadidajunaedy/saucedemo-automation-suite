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

test('User should be able to remove item from cart', async({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addItemToCart("Sauce Labs Backpack");
  await expect(inventoryPage.cartBadge).toHaveText('1');

  await inventoryPage.removeItemFromCart("Sauce Labs Backpack");
  await expect(inventoryPage.cartBadge).toBeHidden();
});

test('User should be able to click item', async({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.goToDetailItem("Sauce Labs Backpack");
  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.locator('.inventory_details_name')).toHaveText("Sauce Labs Backpack");
});

test('User should be able to sort items by Name (A to Z)', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const initialOrderItem: string[] = await page.locator('.inventory_item_name').allTextContents();
  const ascendingOrderItem: string[] = [...initialOrderItem].sort();

  await inventoryPage.sortItems('az');
  const orderAfterSorted: string[] = await page.locator('.inventory_item_name').allTextContents();
  expect(orderAfterSorted).toEqual(ascendingOrderItem);
});

test('User should be able to sort items by Name (Z to A)', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const initialOrderItem: string[] = await page.locator('.inventory_item_name').allTextContents();
  const descendingOrderItem: string[] = [...initialOrderItem].sort().reverse();

  await inventoryPage.sortItems('za');
  const orderAfterSorted: string[] = await page.locator('.inventory_item_name').allTextContents();
  expect(orderAfterSorted).toEqual(descendingOrderItem);
});

test('User should be able to sort items by Price (low to high)', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const initialOrderItem: string[] = await page.locator('.inventory_item_price').allTextContents();
  const lowToHighOrderItem: number[] = [...initialOrderItem].map(price => parseFloat(price.replace('$', ''))).sort((a, b) => a - b);

  await inventoryPage.sortItems('lohi');
  const orderAfterSorted = await page.locator('.inventory_item_price').allTextContents();
  const parsedOrderAfterSorted = [...orderAfterSorted].map(price => parseFloat(price.replace('$', '')));
  expect(parsedOrderAfterSorted).toEqual(lowToHighOrderItem);
});

test('User should be able to sort items by Price (high to low)', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const initialOrderItem: string[] = await page.locator('.inventory_item_price').allTextContents();
  const highToLowOrderItem: number[] = [...initialOrderItem].map(price => parseFloat(price.replace('$', ''))).sort((a, b) => b - a);

  await inventoryPage.sortItems('hilo');
  const orderAfterSorted = await page.locator('.inventory_item_price').allTextContents();
  const parsedOrderAfterSorted = [...orderAfterSorted].map(price => parseFloat(price.replace('$', '')));
  expect(parsedOrderAfterSorted).toEqual(highToLowOrderItem);
});
