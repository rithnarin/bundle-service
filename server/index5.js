const express = require('express');
const Sequelize = require('sequelize');
const db = require('../database/postgres.js');
const bodyParser = require('body-parser');
const sqs = require('./sqs.js');
const Promise = require('bluebird');

require('./bundlin.js');

// comment out if data is already saved
require('../database/saveFakeData.js');

let app = express();

app.use(bodyParser.json());

app.post('/createbundle', (req, res) => {
  db.createBundle(req.query.bundleName, req.query.productId);
  res.end();
});

let count = 0;
app.get('/bundleref', (req, res) => {
  count++;
  db.findBundleWithProduct(req.query.product_id)
    .then((products) => {
      console.log(count);
      res.send(products);
    })
    .catch(err => console.error('Bundle Reference Request Failed'));
});

app.get('/bundleupdate', (req, res) => {
  sqs.getQueue((queue) => {
      // return db.discontinuedProduct(parseInt(queue[0].MessageAttributes.id.StringValue))
        // .then(() => {
        //   sqs.sqs.deleteMessage( { QueueUrl: 'https://sqs.us-west-2.amazonaws.com/084821742333/NEW_PRODUCT', ReceiptHandle: queue[0].ReceiptHandle }, (err, data) => {
        //     if (err) {
        //       console.error('Error deleting message: ', err);
        //     } else if (data) {
        //       console.log('Message deleted: ', parseInt(queue[0].MessageAttributes.id.StringValue));
        //     }
        //   });
        // })
        // .then(() => {
        //   res.end();
        // });
      db.discontinuedProduct(parseInt(queue[queue.length-1].MessageAttributes.id.StringValue));
      sqs.sqs.deleteMessage( { QueueUrl: 'https://sqs.us-west-2.amazonaws.com/084821742333/NEW_PRODUCT', ReceiptHandle: queue[queue.length-1].ReceiptHandle }, (err, data) => {
        if (err) {
          console.error('Error deleting message: ', err);
        } else if (data) {
          console.log('Message deleted: ', parseInt(queue[queue.length-1].MessageAttributes.id.StringValue));
        }
      });
  });
  res.end();
});

app.listen(8080, () => {
  console.log(`Listening on port 5000...`);
});

module.exports = app;
