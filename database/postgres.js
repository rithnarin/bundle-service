const Sequelize = require('sequelize');
const Promise = require('bluebird');
const Op = Sequelize.Op;

let params = { logging: false };

const db = new Sequelize('postgres://rithnarinkong:@localhost:5432/bundleservice', params);

db.authenticate()
  .then(() => console.log('Connection has been established successfully!'))
  .catch(err => console.error('Error connecting:', err));

const Inventory = db.define('inventory', {
  product_name: Sequelize.STRING,
  product_description: Sequelize.STRING,
  product_image: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.STRING,
  inventory_count: Sequelize.INTEGER,
});

const Bundles = db.define('bundles', {
  bundle_name: Sequelize.STRING,
});

const ProductBundles = db.define('prod_bundles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
});

Inventory.belongsToMany(Bundles, { through: ProductBundles });
Bundles.belongsToMany(Inventory, { through: ProductBundles });

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

const findBundleWithProduct = (productId) => {
  return ProductBundles.findOne({ where: { inventoryId: productId } })
    .then(product => {
      return ProductBundles.findAll({ where: { bundleId: product.bundleId } })
    })
    .then(bundles => {
      return findAllProductInBundle(bundles);
    })
    .catch(err => {
      return console.error('Item is not in a bundle');
    });
  // return db.query(`SELECT i2.id, i2.product_name, i2.product_description, i2.product_image, i2.category, i2.price, i2.inventory_count FROM inventories i
  //   INNER JOIN prod_bundles pb
  //     ON i.id = pb."inventoryId"
  //   INNER JOIN bundles b
  //     ON b.id = pb."bundleId"
  //
  //   INNER JOIN prod_bundles pb2
  //     ON pb2."bundleId" = b.id
  //   INNER JOIN inventories i2
  //     ON i2.id = pb2."inventoryId"
  //     WHERE i.id = ${productId}`)
  //     .spread((results, metadata) => {
  //       return results;
  //     })
  //     .catch(() => {
  //       console.log('Failed to get items');
  //     });
}

const findAllProductInBundle = (bundles) => {
  let productIds = [];
  bundles.forEach(product => {
    productIds.push(product.inventoryId);
  });

  return Inventory.findAll({ where: { id: { [Op.or]: productIds } } })
    .then( products => {
      return products;
    })
}

const discontinuedProduct = (productId) => {
  return ProductBundles.destroy({ where: { inventoryId: productId } })
    .catch(err => console.error(`Error deleting product: ${productId}`));
}

exports.db = db;
exports.Inventory = Inventory;
exports.Bundles = Bundles;
exports.ProductBundles = ProductBundles;
exports.createBundle = createBundle;
exports.findBundleWithProduct = findBundleWithProduct;
// exports.findAllProductInBundle = findAllProductInBundle;
exports.discontinuedProduct = discontinuedProduct;
