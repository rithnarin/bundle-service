const Sequelize = require('sequelize');

let params = { logging: false };

// if (!process.env.LOCAL) {
//   params = {
//     dialect: 'postgres',
//     protocol: 'postgres',
//     logging: false,
//     dialectOptions: { ssl: true },
//   };
// }

const db = new Sequelize('postgres://rithnarinkong:@localhost:5432/bundleservice');

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

exports.db = db;
exports.Inventory = Inventory;
exports.Bundles = Bundles;
exports.ProductBundles = ProductBundles;
