'use strict';

module.exports = {
  generateFakeData,
  getProductId
};

const faker = require('faker');

//generateRandomId for all available inventory Items
let generateRandomId = () => {
  return Math.floor(Math.random() * (10626948 - 1 + 1)) + 1;
}

//creates RandomId for artillery
function getProductId(userContext, events, done) {
  let productId = generateRandomId();

  userContext.vars.productId = productId;

  return done();
}

//generateFakeData for artillery load testing to create bundles
function generateFakeData(userContext, events, done) {
  let bundleName = faker.commerce.product();
  let itemIds = [];
  let productAmount = Math.floor(Math.random() * (11 - 3 + 1)) + 3;

  for (var i = 0; i < productAmount; i++) {
    itemIds.push(generateRandomId());
  }

  userContext.vars.bundleName = bundleName;
  userContext.vars.itemIds = itemIds;

  return done();
}
