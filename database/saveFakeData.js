const faker = require('faker');
const Promise = require('bluebird');

const orm = require('./postgres.js');

// orm.db.sync({ force: true })
//   .then(() => orm.Inventory.sync())
//   .then(() => orm.Bundles.sync())
//   .then(() => orm.ProductBundles.sync())
//   .catch(err => console.error('Error creating fake data: ', err));

let saveInventory = () => {
  var inventory = [];
  for (var i = 0; i < 100000; i++) {
    let price = faker.commerce.price();
    let product =  {
      product_name: faker.commerce.productName(),
      product_description: faker.lorem.sentence(),
      product_image: faker.image.image(),
      category: faker.commerce.department(),
      price: parseInt(price).toString(),
      inventory_count: faker.random.number(),
    };
    inventory.push(product);
  }
  orm.Inventory.bulkCreate(inventory);
  Promise.all(inventory)
    .then(inventory => console.log('Saved all inventory'))
    .catch(err => console.error(err));
}

let saveBundle = () => {
  var bundles = [];
  for (var i = 0; i < 100000; i++) {
    let bundle = {
      bundle_name: faker.commerce.product()
    }
    bundles.push(bundle);
  }
  orm.Bundles.bulkCreate(bundles);
  Promise.all(bundles)
    .then(bundle => console.log('Saved all bundles'))
    .catch(err => console.error(err));
}

let saveProdBundles = () => {
  var prodBundles = [];
  for (var i = 0; i <= 10000; i++) {
    var randomInv = Math.floor(Math.random() * (10626948 - 1) + 1);
    var randomBund = Math.floor(Math.random() * (10503373 - 1) + 1);
    let pb = {
      inventoryId: randomInv,
      bundleId: randomBund,
    }
    prodBundles.push(pb);
  }
  orm.ProductBundles.bulkCreate(prodBundles);
  Promise.all(prodBundles)
    .then(prodBundle => console.log('Saved Inventory to Bundles'))
    .catch(err => console.error(err));
}

// saveInventory();
// saveBundle();
// saveProdBundles();
