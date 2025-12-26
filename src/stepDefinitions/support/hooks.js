const playwright = require('@playwright/test');
const { Before, After, BeforeAll, AfterAll, AfterStep } = require('@cucumber/cucumber');
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT) || 60000);
require('dotenv').config();
const { getDate } = require('../../utils/functions');
let browser;
BeforeAll(async function () {
  let playwright_browser_userInput = process.env.PLAYWRIGHT_BROWSER;
  console.log(`Launching Browser is: ${playwright_browser_userInput}`);
  let native_browser_list = ['chromium', 'firefox', 'webkit'];
  let system_installed_browser_list = ['chrome', 'msedge'];
  if (native_browser_list.includes(playwright_browser_userInput)) {
    browser = await playwright[playwright_browser_userInput].launch({
      headless: process.env.BROWSER_HEADLESS === 'Yes' ? true : false,
      args: ['--start-maximized', '--kiosk', '--ignore-certificate-errors'],
      acceptDownloads: true
    });
  } else if (system_installed_browser_list.includes(playwright_browser_userInput)) {
    browser = await playwright['chromium'].launch({
      headless: process.env.BROWSER_HEADLESS === 'Yes' ? true : false,
      args: ['--start-maximized', '--kiosk'],
      acceptDownloads: true,
      channel: `${playwright_browser_userInput}`
    });
  } else {
    throw new Error(`The browser: ${browser} you have choosen is not supported!`);
  }
  let env = process.env.TEST_ENVIRONMENT;
  env = env.toLowerCase();
  switch (env) {
    case 'dev':
      global.baseURL = process.env.BASE_URL_DEV;
      break;
    case 'qa':
      global.baseURL = process.env.BASE_URL_QA;
      break;
    case 'uat':
      global.baseURL = process.env.BASE_URL_UAT;
      break;
    default:
      throw new Error(
        `\n\n############# Incorrect Environment selected: ${process.env.TEST_ENVIRONMENT}. Expected values are: dev/qa/uat ##############`
      );
  }
  console.log(`\n\n############# Environment is: ${env} & url is: ${baseURL} ##############`);
});

AfterAll(async function () {
  console.log('Close Browser');
  await browser.close();
});

Before(async function () {
  console.log(`Default timeout is set as: ${process.env.DEFAULT_TIMEOUT} ms`);
  console.log('Create new context and page');
  global.context = await browser.newContext({
    viewport: null
  });
  global.page = await context.newPage();
});

After(async function () {
  console.log('Close context and page');
  await page.close();
  await context.close();
});
let stepIndex = 1;
AfterStep(async function () {
  const currentDate = getDate();
  this.attach(
    await page.screenshot({
      path: `./reports/cucumberScreenshots/step-${stepIndex++}-${currentDate}.png`,
      fullpage: true
    }),
    'image/png'
  );
});
