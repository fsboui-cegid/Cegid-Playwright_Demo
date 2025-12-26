# Playwright-Cucumber-JavaScript Framework Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Extensions](#extensions-required)
3. [Project Structure](#project-structure)
4. [Writing Tests](#writing-tests)
    - [Creating Feature Files](#creating-feature-files)
    - [Step Definitions](#step-definitions)
5. [Running Tests](#running-tests)
6. [Reporting](#reporting)
7. [Jenkins & JIRA XRAY Integration](#jenkins-integration)
    - [Jenkins Pipeline Configuration](#jenkins-pipeline-configuration)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction
This repository contains a test automation framework using Playwright, Cucumber, and JavaScript. The framework enables behavior-driven development (BDD) for end-to-end testing, ensuring robust and maintainable test suites. It integrates seamlessly with Jenkins for continuous integration and delivery (CI/CD). This framework covers UI and API testing both.

## Getting Started

### Prerequisites
Before setting up the framework, ensure you have the following installed:
- Node.js (>= 18.x)
- npm (>= 10.x)
- Playwright (Latest)
- Cucumber.js (Latest)
- Jenkins (for CI/CD) (As per your Enterprise Project need)

### Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Maruf91/Playwright-Cucumber.git
cd <repository-directory>
npm install
```
### Extensions required
As part of this framework user needs to install a few extensions which are:
1. Cucumber by Microsoft / Cucumber(Gherkin) Full support (Required settings are already written
under settings.json file)
2. ESLint

Optional extensions: 
1. vscode-icons for folder beautification

## Project Structure
Below project structure has been maintained for the implemented framework:
```bash
.
├── src
│   ├── features
│   │   └── *.feature
│   ├── stepDefinitions
│   │   ├── support
│   │   │   └── hooks.js
│   │   └── *.js
│   ├── pageObjects
│   │   └── *.js
│   └── utils
│       └── *.js
├── .github
├── .vscode
├── cucumber
├── reports
├── node_modules
├── testdata
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── cucumber.js
├── Jenkinsfile
├── package-lock.json
├── package.json
└── README.md

If your project has any client provided Artifactory, then you need to add one file at root level named as ".npmrc", where user needs to provide authentication details, when 'npm install' will download the modules it will check the vulnerabilities during runtime.
```
## Writing Tests

### Creating Feature Files
Feature files describe the test scenarios in a human-readable format:
```bash
Feature: Example feature

  Scenario: Example scenario
    Given I navigate to the homepage
    When I click on the login button
    Then I should see the login form
```    
### Step Definitions
Step definitions connect feature file steps to Playwright actions:

```bash
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I navigate to the homepage', async function () {
    await page.goto('https://example.com');
});

When('I click on the login button', async function () {
    await page.click('#login-button');
});

Then('I should see the login form', async function () {
    expect(await page.isVisible('#login-form')).toBe(true);
});
```
## Running Tests

### Before running the test case setup your .env file
In this .env file you can setup your cucumber tags(Test cases/suites, test environment, testing url etc.)

Use below command to run your test cases(it's customised)
```bash

npm run cucumberTest

```
## Reporting
Cucumber HTML report is integrated for this framework where each step will take snap of the 
application and place it in report along with pass/fail status.
How to run report command to generate HTML report after running all the test cases:
```bash

npm run cucumberReport

```

## Jenkins & JIRA XRAY Integration

### Jenkins Pipeline Configuration
```bash

A jenkins pipeline has been developed from scratch to run this framework in remote system as part of CI/CT.
The pipeline has been already tested and proven. The pipeline can be run on MAC/WINDOWS/UNIX system
, its developed in such a way that it can handlle any type of remote system.
The pipeline is JIRA XRAY integrated, i,e. it can update pass/fail status of the pre created manual 
regression/smoke suites.

To understand the pipeline and to integrate in your project please reach out to Owner of this project
[owner mail-id: mdmarufmallick@gmail.com]

```

## Contributing
This is fully developed by myself from scratch.
This is a portable framework.
`Contributer: Md Maruf Mallick`

## License
There is no need of license to use the framework as it's using all the open source products.
Individual products has their own open source license.
## N.B This is a developing framewrok, in future this framewrok will be more robust and more powerful.