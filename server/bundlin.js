const axios = require('axios');
const faker = require('faker');

const getBundleRef = (productId) => {
  axios.get(`http://localhost:5000/bundleref?product_id=${productId}`)
    .then(products => {
      console.log('Got all products in the bundle: ', products);
    })
    .catch(err => {});
};

const createNewBundle = (bundleName, itemIds) => {
  axios.post(`http://localhost:5000/createbundle`, { bundleName, itemIds });
};

const createBundle = (bundleName, itemId) => {
  bundleName = faker.commerce.product();
  itemIds = Math.floor(Math.random() * (10626948 - 1) + 1);
    axios.post(`http://localhost:5000/createbundle?bundleName=${bundleName}&productId=${itemId}`)
      .then(bundle => {
        console.log('New bundle created: ', bundle);
        return bundle;
      })
      .catch(err => {});
}

// getBundleRef(1315);
createNewBundle('Nice Items', [634, 93240, 1424102]);
// for (var i = 0; i < 100000; i++) {
//   createBundle();
// }

exports.getBundleRef = getBundleRef;
exports.createNewBundle = createNewBundle;
exports.createBundle = createBundle;
