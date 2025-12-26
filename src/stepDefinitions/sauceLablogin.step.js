const { Given, When, Then, defineStep } = require('@cucumber/cucumber');
const { LoginPage } = require('../pageObjects/sauceLablogin.page');

let loginPage = new LoginPage();

Given('I visit a login page', async function () {
  await loginPage.navigateToLoginScreen();
});

When('I fill the login form with valid credentials', async function () {
  await loginPage.submitLoginForm();
});

Then('I should see the home page', async function () {
  await loginPage.assertUserIsLoggedIn();
});

Then('I wait for {string} seconds', async function (seconds) {
  await loginPage.pause(seconds);
});

defineStep('I fill the login form with {string} and {string}', async function (username, password) {
  await loginPage.submitLoginWithParameters(username, password);
});
Then('I click on product from listing', async () => {
  await loginPage.clickOnProduct();
});
