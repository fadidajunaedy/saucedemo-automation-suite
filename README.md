# Saucedemo Automation Suite

This project contains a collection of automated tests built for the Saucedemo website.

I built this project to demonstrate my capability in creating a scalable and maintainable test automation framework using Playwright and TypeScript.

It showcases how I structure code using the Page Object Model (POM) pattern, handle strict type checking, and solve common automation challenges like dynamic element filtering and price calculation validation.

The tests are written using:
- **Language**: Typescript
- **Framework**: Playwright
- **Pattern**: Page Object Model (POM)

## Automated Features
### 1. Functional Test (Per Page)
- **Login Page**: Authentication flows (valid & invalid).
- **Inventory Page**: Product listing and sorting logic.
- **Inventory Item Page**: Individual product verification.
- **Checkout Info**: Customer information form handling.
- **Checkout Overview**: Order summary and price calculation checks.

### 2. End-to-End (E2E)
#### 2.1. Checkout Flow
- User should be able completed a pucshase flow with single item
- User should be able completed a pucshase flow with multiple item
- User should not be able to checkout if not fill checkout information
- User should be able to cancel checkout in last minute
#### 2.2. Cart Interaction
- User should be able to update cart state (add and remove items) correctly
- User should be able to add an item to the cart from the product detail page
- Cart content should remain persistent when navigating back to shopping
