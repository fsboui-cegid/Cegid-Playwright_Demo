const playwright = require('@playwright/test');
const { Before, After, BeforeAll, AfterAll, AfterStep } = require('@cucumber/cucumber');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT) || 60000);

require('dotenv').config();
const { getDate } = require('../../utils/functions');

let browser;

function resolveBaseUrl() {
  let env = (process.env.TEST_ENVIRONMENT || '').toLowerCase();
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
      throw new Error(`Incorrect Environment: ${process.env.TEST_ENVIRONMENT}. Expected dev/qa/uat`);
  }
  console.log(`Environment: ${env} | baseURL: ${global.baseURL}`);
}

BeforeAll(async function () {
  // 1) ton code existant pour baseURL
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
      throw new Error(`Incorrect Environment: ${process.env.TEST_ENVIRONMENT}. Expected dev/qa/uat`);
  }

  const isLambdaTest = (process.env.LT_RUN || '').toLowerCase() === 'true';
  console.log('LT_USERNAME set:', !!process.env.LT_USERNAME);
  console.log('LT_ACCESS_KEY set:', !!process.env.LT_ACCESS_KEY);
  // 2) ✅ mode LambdaTest (connect)
  if (isLambdaTest) {
    const capabilities = {
      browserName: 'Chrome', // ou MicrosoftEdge / pw-chromium / pw-firefox / pw-webkit
      browserVersion: 'latest',
      tunnel: process.env.LT_TUNNEL === 'true',
      tunnelName: process.env.LT_TUNNEL_NAME,
      'LT:Options': {
        platform: 'Windows 10',
        build: 'Playwright Sample Build',
        name: 'Playwright Sample Test',
        user: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
        network: true,
        video: true,
        console: true
      }
    };

    const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
      JSON.stringify(capabilities)
    )}`;

    // ✅ c’est ça qui te manquait
    browser = await playwright.chromium.connect({ wsEndpoint });
    return;
  }

  // 3) ton mode local inchangé (launch)
  let playwright_browser_userInput = process.env.PLAYWRIGHT_BROWSER;
  console.log(`Launching Browser is: ${playwright_browser_userInput}`);

  let native_browser_list = ['chromium', 'firefox', 'webkit'];
  let system_installed_browser_list = ['chrome', 'msedge'];

  if (native_browser_list.includes(playwright_browser_userInput)) {
    browser = await playwright[playwright_browser_userInput].launch({
      headless: process.env.BROWSER_HEADLESS === 'Yes',
      args: ['--start-maximized', '--kiosk', '--ignore-certificate-errors'],
      acceptDownloads: true
    });
  } else if (system_installed_browser_list.includes(playwright_browser_userInput)) {
    browser = await playwright['chromium'].launch({
      headless: process.env.BROWSER_HEADLESS === 'Yes',
      args: ['--start-maximized', '--kiosk'],
      acceptDownloads: true,
      channel: `${playwright_browser_userInput}`
    });
  } else {
    throw new Error(`The browser: ${playwright_browser_userInput} is not supported!`);
  }
});

AfterAll(async function () {
  console.log('Close Browser');
  await browser.close();
});

Before(async function () {
  console.log(`Default timeout: ${process.env.DEFAULT_TIMEOUT} ms`);
  console.log('Create new context and page');

  // ❌ On enlève permissions: ['local-network-access'] (ça casse selon version Playwright)
  global.context = await browser.newContext({ viewport: null });
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
      fullPage: true
    }),
    'image/png'
  );
});
