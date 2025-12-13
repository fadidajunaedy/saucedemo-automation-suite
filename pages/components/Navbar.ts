import { type Locator, type Page } from "@playwright/test";

export class Navbar {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartButton = page.locator('.shopping_cart_link');
  }

  async goToCart() {
    await this.cartButton.click();
  }
}
