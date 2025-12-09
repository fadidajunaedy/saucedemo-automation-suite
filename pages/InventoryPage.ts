import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartButton = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemName: string) {
    await this.page.locator('.inventory_item')
    .filter({ hasText: itemName })
    .getByRole('button', { name: 'Add to cart' }).
    click();
  }

  async clickItem(itemName: string) {
    await this.page.locator('.inventory_item')
    .filter({ hasText: itemName })
    .locator('.inventory_item_name')
    .click();
  }

  async goToCart() {
    await this.cartButton.click();
  }
}
