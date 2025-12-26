@Regression_SettingMenu
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
        # And I click on Admin menu
        # Then I can see Admin-User Management page is displayed
        # And I click on "Qualifications" dropdown menu
        # And I click on "Education" submenu
        # Then I validate no of records found as "<numberOfRecords>"

        Examples:
            | username | password   | leftPanelMenu                                                                                   | numberOfRecords |
            | admin    | talentsoft | Admin,PIM,Leave,Time,Recruitment,My Info,Performance,Dashboard,Directory,Maintenance,Claim,Buzz | 4               |
