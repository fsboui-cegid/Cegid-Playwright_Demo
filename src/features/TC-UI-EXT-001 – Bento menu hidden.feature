@ScoreCard
Feature: Avatar menu content for External Assessor

  As an External Assessor
  
  So that I can access my account options without errors
  I want to see the bento menu is hidden

  Background:
    Given I am logged in as an External Assessor

  Scenario: Verify avatar menu displays correct options
    When I click on the user avatar
    Then the account name should be displayed
    And the "Log out" button should be visible
    And the language switch dropdown should be visible
    And Navigate to "ScoreCard Management" page
    Then "no" bento menu is displayed