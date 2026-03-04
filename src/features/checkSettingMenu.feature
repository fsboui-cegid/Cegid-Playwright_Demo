@ScoreCard
Feature: Validate dropdown menus and number of records are displaying on the page
    As an user
    I want to login into the application
    and I want to validate dropdown menus and number records are displaying under Education sub menu.

    @Backoffice_SettingMenu_TestCase
    Scenario Outline: Login with valid credentials and validate admin page records
        Given I launch BO url
        When I provide "<username>" and "<password>" and click on login button
        Then I should be connected to Backoffice dashboard page
        And I open the menu
        Then I validate all options are displaying

        Examples:
            | username | password   |
            | admin    | talentsoft |
