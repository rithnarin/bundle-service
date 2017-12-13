const faker = require('faker');
var Promise = require('bluebird');

var orm = require('./postgres.js');

// orm.db.sync({ force: true })
//   .then(() => orm.Inventory.sync())
//   .then(() => orm.Bundles.sync())
//   .then(() => orm.ProductBundles.sync())
//   .catch(err => console.error('Error creating fake data: ', err));

let saveInventory = () => {
  var inventory = [];
  for (var i = 0; i < 5000; i++) {
    let price = faker.commerce.price();
    let product =  {
      product_name: faker.commerce.productName(),
      product_description: faker.lorem.sentence(),
      product_image: faker.image.image(),
      category: faker.commerce.department(),
      price: parseInt(price).toString(),
      inventory_count: faker.random.number(),
    };
    inventory.push(orm.Inventory.create(product));
  }
  Promise.all(inventory)
    .then(inventory => console.log('Saved all inventory'))
    .catch(err => console.error(err));
}

let saveBundle = () => {
  var bundles = [];
  for (var i = 0; i < 2000; i++) {
    let bundle = {
      bundle_name: faker.commerce.product()
    }
    bundles.push(orm.Bundles.create(bundle));
  }
  Promise.all(bundles)
    .then(bundle => console.log('Saved all bundles'))
    .catch(err => console.error(err));
}

let saveProdBundles = () => {
  var prodBundles = [];
  for (var i = 0; i <= 2000; i++) {
    var randomInv = Math.random() * (5000 - 1) + 1;
    var randomBund = Math.random() * (2000 - 1) + 1;
    let pb = {
      inventoryId: randomInv,
      bundleId: randomBund,
    }
    prodBundles.push(orm.ProductBundles.create(pb));
  }
  Promise.all(prodBundles)
    .then(prodBundle => console.log('Saved all bundles'))
    .catch(err => console.error(err));
}

saveInventory();
saveBundle();
saveProdBundles();
