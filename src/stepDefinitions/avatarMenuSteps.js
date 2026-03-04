const { Given, When, Then } = require('@cucumber/cucumber');
const { AvatarMenuPage } = require('../pageObjects/avatarMenuPage');
const { exec } = require('child_process');

let avatarMenuPage;

Given('I am logged in as an External Assessor', { timeout: 30000 }, async () => {
  await new Promise((resolve, reject) => {
    exec('node sql-connexion_Ext-Assessor.js', (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
  await page.goto('https://oar-trmmaster-preprod-rh.dev.talentsoft.net/');
  await page.locator('//input[@name="Username"]').fill('admin');
  await page.locator('#Password').fill('talentsoft');
  await page.locator('.btn').click();
  avatarMenuPage = new AvatarMenuPage(page);
});

Given('I am logged in as an Internal Assessor', { timeout: 30000 }, async () => {
  await new Promise((resolve, reject) => {
    exec('node sql-connexion_Int-Assessor.js', (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
  await page.goto('https://oar-trmmaster-preprod-rh.dev.talentsoft.net/');
  await page.locator('//input[@name="Username"]').fill('admin');
  await page.locator('#Password').fill('talentsoft');
  await page.locator('.btn').click();
  avatarMenuPage = new AvatarMenuPage(page);
});

When('I click on the user avatar', async () => {
  await avatarMenuPage.clickAvatar();
});

Then('the account name should be displayed', async () => {
  await avatarMenuPage.checkAccountNameVisible();
});

Then('the {string} button should be visible', async (buttonName) => {
  if (buttonName === 'Log out') {
    await avatarMenuPage.checkLogoutButtonVisible();
  }
});

Then('the language switch dropdown should be visible', async () => {
  await avatarMenuPage.checkLanguageDropdownVisible();
});

Then('Navigate to {string} page', async (scrCardPage) => {
  if (scrCardPage === 'ScoreCard Management') {
    await page.locator('//button[@title="Open navigation menu"]').click();
    await page.locator('//a[@href="https://oar-trmmaster-preprod-trm.dev.talentsoft.net/"]').click();
  }
});

Then('{string} bento menu is displayed', async (presence) => {
  if (presence === 'no') {
    await page.waitForTimeout(5000);
    if ((await page.locator('//button[@aria-label="My apps"]').count()) > 0) {
      throw new Error('Bento menu should not be displayed');
    }
  } else if (presence === 'yes') {
    await page.locator('//button[@aria-label="My apps"]').waitFor({ state: 'visible' });
  }
});
