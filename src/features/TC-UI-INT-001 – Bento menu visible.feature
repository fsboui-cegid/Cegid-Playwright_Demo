@ScoreCard
Feature: Avatar menu content for Internal Assessor

  As an Internal Assessor

  So that I can access my account options without errors
  I want to see the bento menu is displayed

  Background:
    Given I am logged in as an Internal Assessor
 
  Scenario: Verify avatar menu displays correct options
    When I click on the user avatar
    Then the account name should be displayed
    And the "Log out" button should be visible
    And the language switch dropdown should be visible
    And Navigate to "ScoreCard Management" page
    Then "Yes" bento menu is displayed