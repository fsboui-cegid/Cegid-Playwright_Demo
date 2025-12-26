require('dotenv').config();
const common = `
    --require stepDefitions/support/hooks.js
    --require src/stepDefitions/**/*.js
    --format json:cucumber/cucumber_report.json
    --format message:cucumber/cucumber_report.json
    --format html:cucumber/cucumber_report.json
    --format progress-bar
    --format @cucumber/pretty-formatter
    --format-options ${JSON.stringify({ snippetInterface: 'async-await' })}
`;
function getCucumberTags() {
  let getTags = process.env.CUCUMBER_FILTER_TAGS;
  let tag;
  if (getTags.includes(',')) {
    tag = getTags
      .split(',')
      .map((item) => item.trim())
      .join(' or ');
    console.log('Test running with Tags: ', tag);
    return tag;
  } else {
    tag = getTags.trim();
    console.log('Test running with Tags: ', tag);
    return tag;
  }
}
module.exports = {
  default: `${common} src/features/**/*.feature --parallel ${
    process.env.CUCUMBER_PARALLEL_WORKERS
  } --tags "${getCucumberTags()}"`,
  allure: {
    format: './cucumber/allureReporter.js'
  }
};
