import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartButton: Locator;
  readonly itemSortContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartButton = page.locator('.shopping_cart_link');
    this.itemSortContainer = page.locator('.product_sort_container');
  }

  async sortItems(sortOrder: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.itemSortContainer.selectOption(sortOrder);
  }

  async addItemToCart(itemName: string) {
    await this.page.locator('.inventory_item')
    .filter({ hasText: itemName })
    .getByRole('button', { name: 'Add to cart' }).
    click();
  }

  async removeItemFromCart(itemName: string) {
    await this.page.locator('.inventory_item')
    .filter({ hasText: itemName })
    .getByRole('button', { name: 'Remove' }).
    click();
  }

  async goToDetailItem(itemName: string) {
    await this.page.locator('.inventory_item')
    .filter({ hasText: itemName })
    .locator('.inventory_item_name')
    .click();
  }

  async goToCart() {
    await this.cartButton.click();
  }
}
