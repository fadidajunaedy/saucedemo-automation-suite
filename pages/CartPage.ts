import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }

  async removeItemFromCart(itemName: string) {
    await this.page.locator('.cart_item')
    .filter({ hasText: itemName })
    .getByRole('button', { name: 'Remove' })
    .click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click()
  }
}
