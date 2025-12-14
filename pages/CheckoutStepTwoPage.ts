import { type Locator, type Page } from "@playwright/test";

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly subTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('#cancel');
  }

  async getSubTotal(): Promise<number> {
    const rawText = await this.subTotalLabel.textContent() ||  '';
    const cleanText = rawText.replace(/[^0-9.]/g, '');
    return parseFloat(cleanText)
  }

  async getTax(): Promise<number> {
    const rawText = await this.taxLabel.textContent() ||  '';
    const cleanText = rawText.replace(/[^0-9.]/g, '');
    return parseFloat(cleanText)
  }

  async getTotal(): Promise<number> {
    const rawText = await this.totalLabel.textContent() ||  '';
    const cleanText = rawText.replace(/[^0-9.]/g, '');
    return parseFloat(cleanText)
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }
}
