class boLoginPage {
  constructor() {
    this.userName = "//input[@id='login-userName']";
    this.password = "//input[@id='login-pwd']";
    this.loginButton = "//input[@id='login-submit']";
  }
  /* Here explicit waits have been used to take the screenshot properly! */
  async launchURL() {
    await page.goto(baseURL);
    // await page.waitForTimeout(10000);
  }
  async loginProcess(username, password) {
    await page.locator(this.userName).type(username);
    await page.locator(this.password).type(password);
    // await page.waitForTimeout(1000);
    await page.locator(this.loginButton).click();
  }
}
module.exports = { boLoginPage };
