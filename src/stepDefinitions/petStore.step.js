const { Given, When, Then } = require('@cucumber/cucumber');
const { PetStoreAPI } = require('../pageObjects/petStore.page');
const petStoreApi = new PetStoreAPI();
Given('the PetStore API is available', async () => {
  await petStoreApi.getApiAvailability();
});
When('I add a new pet with the following details', async (table) => {
  await petStoreApi.addNewPet(table);
});
Then('the response status should be {int}', async (statusCode) => {
  await petStoreApi.getStatusCode(statusCode);
});
Then('the response should contain the added pet details', async () => {
  await petStoreApi.getMatchingResponseDetails();
});
Then('I request the pet with ID {int}', async (petId) => {
  await petStoreApi.searchPetById(petId);
});
