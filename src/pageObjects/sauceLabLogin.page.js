const { captureScreenshot } = require('../utils/functions');
class LoginPage {
  constructor() {
    this.backpackProduct = "//div[contains(text(),'Sauce Labs Backpack')]";
  }
  async navigateToLoginScreen() {
    await page.goto('https://www.saucedemo.com/');
    await captureScreenshot(page);
    await captureScreenshot(page);
  }

  async submitLoginForm() {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await captureScreenshot(page);
    await captureScreenshot(page);
  }

  async submitLoginWithParameters(username, password) {
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    await captureScreenshot(page);
  }

  async assertUserIsLoggedIn() {
    await page.waitForSelector('.inventory_list');
    await captureScreenshot(page);
  }

  async pause(seconds) {
    const time = seconds * 1000;
    await page.waitForTimeout(time);
  }
  async clickOnProduct() {
    await page.locator(this.backpackProduct).click();
    await captureScreenshot(page);
  }
}

module.exports = { LoginPage };
