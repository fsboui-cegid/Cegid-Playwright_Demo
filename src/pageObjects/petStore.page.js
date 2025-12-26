//const { request } = require('playwright');
const { request, expect } = require('@playwright/test');
let apiContext;
let response;
let addedPetId;
class PetStoreAPI {
  async getApiAvailability() {
    apiContext = await request.newContext();
  }

  async addNewPet(table) {
    const petDetails = table.rowsHash();
    console.log('petDetails : ', petDetails);
    petDetails.photoUrls = JSON.parse(petDetails.photoUrls);
    addedPetId = parseInt(petDetails.id, 10);
    console.log('petDetails : ', petDetails);
    const petJsonFormat = {
      id: addedPetId,
      category: {
        id: 0,
        name: 'Hybrid'
      },
      name: petDetails.name,
      photoUrls: petDetails.photoUrls,
      tags: [
        {
          id: 0,
          name: 'string'
        }
      ],
      status: petDetails.status
    };
    console.log('petJsonFormat: ', petJsonFormat);
    const url = `${process.env.Base_Uri}/pet`;
    //console.log('The full url is: ', url);
    response = await apiContext.post(url, {
      headers: {
        api_key: 'special_key',
        'Content-Type': 'application/json'
      },
      data: petJsonFormat
    });
  }
  async getStatusCode(statusCode) {
    console.log('Response status code is: ', response.status());
    expect(response.status()).toBe(statusCode);
  }
  async getMatchingResponseDetails() {
    const data = await response.json();
    expect(data).toMatchObject({
      id: addedPetId,
      name: 'Cat',
      status: 'available',
      photoUrls: ['https://google.com/photo1']
    });
  }
  async searchPetById(petId) {
    apiContext = await request.newContext();
    const url = `${process.env.Base_Uri}/pet/${parseInt(addedPetId)}`;
    response = await apiContext.get(url, {
      headers: {
        api_key: 'special_key',
        'Content-Type': 'application/json'
      }
    });
    const responseData = await response.json();
    console.log('Pet detail is: ', responseData);
    console.log('Pet id is: ', responseData.id);
    expect(response.ok()).toBeTruthy();
    expect(responseData.id).toEqual(petId);
  }
}
module.exports = { PetStoreAPI };
