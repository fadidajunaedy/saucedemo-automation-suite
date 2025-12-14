import { type Locator, type Page } from "@playwright/test";
import { Navbar } from "./components/Navbar";

export class InventoryItemPage {
  readonly page: Page;
  readonly navbar: Navbar;
  readonly backButton: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new Navbar(page);
    this.backButton = page.locator('#back-to-products');
    this.addToCartButton = page.locator('#add-to-cart');
    this.removeFromCartButton = page.locator('#remove');
  }

  async backToInventory() {
    await this.backButton.click();
  }

  async addItemToCart() {
    await this.addToCartButton.click()
  }

  async removeItemFromCart() {
    await this.removeFromCartButton.click()
  }
}
