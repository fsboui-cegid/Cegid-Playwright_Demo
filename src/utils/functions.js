function getExcelData(excelSheetPath, excelSheetName) {
  var XLSX = require('xlsx');
  var path = require('path');
  var filePath = path.resolve(excelSheetPath);
  var workbook = XLSX.readFile(filePath);
  var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[excelSheetName]);
  console.log(excelData);
  return excelData;
}

function getDate() {
  let date = new Date();
  let currentDate =
    date.getDate() +
    '_' +
    (date.getMonth() + 1) +
    '_' +
    date.getFullYear() +
    '_' +
    date.getHours() +
    '_' +
    date.getMinutes() +
    '_' +
    date.getSeconds() +
    '_' +
    date.getMilliseconds();
  return currentDate;
}
/**
 * The method helps to select items from dropdown
 *@author Maruf
 *@since 09-03-2024
 *@param {*} dropdownElementLocator
 *@param {*} dropdownText
 */
async function selectFromDropdown(dropdownElementLocator, dropdownText) {
  await page.locator(dropdownElementLocator).selectOption({ label: dropdownText });
}
/**
 * The method helps to select items from dropdown if ul/li tag is present
 *@author Maruf
 *@since 09-03-2024
 *@param {*} dropdownElementLocator
 *@param {*} dropdownAllElementsLocator
 *@param {*} dropdownText
 */
async function selectFromDropdown_Ul_Li(dropdownElementLocator, dropdownAllElementsLocator, dropdownText) {
  await page.locator(dropdownElementLocator).click();
  let dropdownElements = await page.locator(dropdownAllElementsLocator);
  for (let i = 0; i < (await dropdownElements.count()); i++) {
    if ((await dropdownElements.nth(i).innerText()) == dropdownText) {
      await dropdownElements.nth(i).click();
    }
  }
}

/**
 * The method helps to delete screenshots after generating the report
 *@author Maruf
 *@since 09-03-2024
 */
async function removeScreenshots() {
  const fs = require('fs');
  const path = require('path');
  const screenshotPath = `./reports/cucumberScreenshots`;
  try {
    const files = fs.readdirSync(screenshotPath);
    files.forEach((file) => {
      const filePath = path.join(screenshotPath, file);
      fs.unlinkSync(filePath);
    });
    console.log('All screenshots are deleted');
  } catch (error) {
    console.log(`Error removing screenshots: ${error.message}`);
  }
}
const args = process.argv.slice(2);
if (args[0] === 'removeScreenshots') {
  removeScreenshots();
} else {
  console.log('No screenshots to delete...');
}

module.exports = {
  getExcelData,
  getDate,
  selectFromDropdown,
  selectFromDropdown_Ul_Li
};
