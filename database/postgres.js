const Sequelize = require('sequelize');
const Promise = require('bluebird');
const Op = Sequelize.Op;

require('dotenv').config();

let params = { logging: false };

const db = new Sequelize(process.env.DATABASE_URL, params);

db.authenticate()
  .then(() => console.log('Connection to database successful!!'))
  .catch(err => console.error('Error connecting:', err));

// Inventory Schema
const Inventory = db.define('inventory', {
  product_name: Sequelize.STRING,
  product_description: Sequelize.STRING,
  product_image: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.STRING,
  inventory_count: Sequelize.INTEGER,
});

// Bundles Schema
const Bundles = db.define('bundles', {
  bundle_name: Sequelize.STRING,
});

// Join table for inventory and bundles
const ProductBundles = db.define('prod_bundles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
});

Inventory.belongsToMany(Bundles, { through: ProductBundles });
Bundles.belongsToMany(Inventory, { through: ProductBundles });

// create bundles
const createBundle = (bundleName, itemIds) => {
  const newBundle = {
    bundle_name: bundleName,
  }
  return Bundles.findCreateFind({ where: { bundle_name: bundleName }, defaults: bundleName })
    .spread(bundle => {
      Promise.each(itemIds, id => {
        return ProductBundles.create({
          inventoryId: id,
          bundleId: bundle.id,
        })
        .catch(() => console.log('Item already exists in bundle.'));
      });
    })
    .then(() => console.log('Bundle Created:', bundleName))
    .catch(err => console.error('Failed to create bundle.'));
}

// find all products in a bundle using one of the products id
const findBundleWithProduct = (productId) => {
  // comment out to use raw sql queries
  // return ProductBundles.findOne({ where: { inventoryId: productId } })
  //   .then(product => {
  //     return ProductBundles.findAll({ where: { bundleId: product.bundleId } })
  //   })
  //   .then(bundles => {
  //     return findAllProductInBundle(bundles);
  //   })
  //   .catch(err => {
  //     return console.error('Item is not in a bundle');
  //   });

  // raw sql query to get all products in a bundle using one of the products id
  // uncomment to not use sequelize queries

  return db.query(`SELECT i2.id, i2.product_name, i2.product_description, i2.product_image, i2.category, i2.price, i2.inventory_count FROM inventories i
    INNER JOIN prod_bundles pb
      ON i.id = pb."inventoryId"
    INNER JOIN bundles b
      ON b.id = pb."bundleId"

    INNER JOIN prod_bundles pb2
      ON pb2."bundleId" = b.id
    INNER JOIN inventories i2
      ON i2.id = pb2."inventoryId"
      WHERE i.id = ${productId}`)
      .spread((results, metadata) => {
        return results;
      })
      .catch(() => {
        console.log('Failed to get items');
      });
}

// used with findBundleWithProduct to get items in a bundle
const findAllProductInBundle = (bundles) => {
  let productIds = [];
  let sendProducts;
  bundles.forEach(product => {
    productIds.push(product.inventoryId);
  });
  return Inventory.findAll({ where: { id: { [Op.or]: productIds } } })
    .then(products => {
      sendProducts = products;
      sendProducts.unshift({ bundleId: bundles[0].dataValues.bundleId });
      return products;
    })
}

// deletes product from bundle that has been discontinued
const discontinuedProduct = (productId) => {
  return ProductBundles.destroy({ where: { inventoryId: productId } })
    .catch(err => console.error(`Error deleting product: ${productId}`));
}

// find the bundle id for which a product belongs to
const getBundleId = (productId) => {
  return ProductBundles.findOne({ where: { inventoryId: productId } })
    .then(row => {
      return row.bundleId;
    })
    .catch(() => console.error('Not in any bundles'));
}

// gets all the products in a bundle using just the bundle id
const getProductsInBundle = (bundleId) => {
  return ProductBundles.findAll({ where: { bundleId: bundleId } })
    .then(products => {
      return findAllProductInBundle(products);
    });
}

exports.db = db;
exports.Inventory = Inventory;
exports.Bundles = Bundles;
exports.ProductBundles = ProductBundles;
exports.createBundle = createBundle;
exports.findBundleWithProduct = findBundleWithProduct;
exports.findAllProductInBundle = findAllProductInBundle;
exports.discontinuedProduct = discontinuedProduct;
exports.getBundleId = getBundleId;
exports.getProductsInBundle = getProductsInBundle;
