const { Given, When, Then } = require('@cucumber/cucumber');
const { boLoginPage } = require('../pageObjects/boLogin.page');
const { boDashboard } = require('../pageObjects/boDashboard.page');
const dashBoardPage = new boDashboard();
const loginBoPage = new boLoginPage();

Given('I launch BO url', async () => {
  await loginBoPage.launchURL();
});
When('I provide {string} and {string} and click on login button', async (username, password) => {
  await loginBoPage.loginProcess(username, password);
});
Then('I should be connected to Backoffice dashboard page', async () => {
  await dashBoardPage.dashboardPAgeValidation();
});
Then('I open the menu', async () => {
  await dashBoardPage.openMenu();
});
Then('I validate all options are displaying', async () => {
  await dashBoardPage.checkAllMenuOptions();
});
Then('I can see Admin-User Management page is displayed', async () => {
  await dashBoardPage.adminPageValidation();
});
Then('I click on {string} dropdown menu', async (qualificationMenu) => {
  await dashBoardPage.clickOnQualificationMenu(qualificationMenu);
});
Then('I click on {string} submenu', async (eduMenu) => {
  await dashBoardPage.clickOnEducationMenu(eduMenu);
});
Then('I validate no of records found as {string}', async (numberOfRecords) => {
  await dashBoardPage.numberOfRecordsValidation(numberOfRecords);
});
