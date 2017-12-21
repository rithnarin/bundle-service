const express = require('express');
const Sequelize = require('sequelize');
const db = require('../database/postgres.js');
const bodyParser = require('body-parser');
const sqs = require('./sqs.js');
const Promise = require('bluebird');
const redis = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// simulate requests
// require('./bundlin.js');

// comment out if data is already saved
// require('../database/saveFakeData.js');

let app = express();
let client = redis.createClient();

app.use(bodyParser.json());

//route to create bundle
app.post('/createbundle', (req, res) => {
  db.createBundle(req.body.bundleName, req.body.itemIds);
  res.end();
});

//route to get all items in a bundle
app.get('/bundleref', (req, res) => {
  let result;

  client.get((req.query.product_id).toString(), (err, reply) => {
    if (reply) {
      result = JSON.parse(reply);
      res.send(result);
    } else {
      db.findBundleWithProduct(req.query.product_id)
        .then(products => {
          result = JSON.stringify(products);
          return products;
        })
        .then(products => {
          if (products) {
            client.set((req.query.product_id).toString(), result);
            return products;
          } else {
            res.end();
          }
        })
        .then(products => {
          res.send(products);
        })
        .catch(err => console.error('Bundle Reference Request Failed'));
    }
  });
});

//route to go into the queue to update bundles
app.get('/bundleupdate', (req, res) => {
  sqs.getQueue((queue) => {
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

client.on('connect', () => {
  console.log('Redis connected');
});

app.listen(5000, () => {
  console.log(`Listening on port 5000...`);
});

module.exports = app;
