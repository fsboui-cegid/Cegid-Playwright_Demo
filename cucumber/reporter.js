const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
const { getDate } = require('../src/utils/functions');
const currentDate = getDate();
require('dotenv').config();

let getPlatform = () => {
  if (process.platform === 'win32') return 'Windows';
  else if (process.platform === 'darwin') return 'Mac';
  else if (process.platform === 'linux') return 'Linux';
  else return 'Unknown Platform';
};

const screenshotsDirectory = './reports/cucumberScreenshots/';
const screenshots = fs.readdirSync(screenshotsDirectory).map((file) => {
  return path.join(screenshotsDirectory, file);
});
const screenshotAttachments = screenshots.map((screenshot) => {
  return {
    type: 'image/png',
    encoding: 'base64',
    content: fs.readFileSync(screenshot, 'base64'),
    name: path.basename(screenshot)
  };
});

const options = {
  theme: 'bootstrap',
  jsonFile: 'cucumber/cucumber_report.json',
  output: 'reports/cucumberReports/cucumber_report_' + currentDate + '.html',
  reportSuiteAsScenario: true,
  scenarioTimestamp: true,
  //screenshotsDirectory: './reports/cucumberScreenshots/',
  storeScreenshots: false,
  launchReport: true,
  metadata: {
    'App Version': 'Sample App 2.0.0',
    'Test Environment': `${process.env.TEST_ENVIRONMENT}`,
    Browser: `${process.env.PLAYWRIGHT_BROWSER}`,
    Platform: getPlatform()
  },
  screenshots: screenshotAttachments
};

reporter.generate(options);
