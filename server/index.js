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

//route to check Connection
app.get('/', (req, res) => {
  res.end('Hello World!');
});

// route to create bundle
app.post('/createbundle', (req, res) => {
  db.createBundle(req.body.bundleName, req.body.itemIds);
  res.end();
});

// route to get all items in a bundle
app.get('/bundleref', (req, res) => {
  let result;
  let bundleId;

  db.getBundleId(parseInt(req.query.product_id))
    .then(id => {
      bundleId = id;
    })
    .then(() => {
      if (bundleId) {
        client.get(bundleId, (err, reply) => {
          if (reply) {
            result = JSON.parse(reply);
            res.send(result);
          } else {
            db.getProductsInBundle(bundleId)
              .then(products => {
                bundleId = (products[0].bundleId).toString();
                products.shift();
                result = JSON.stringify(products);
                return products;
              })
              .then(products => {
                client.set(bundleId, result);
                res.send(products);
              })
              .catch(err => {
                console.error('Bundle Reference Request Failed', req.query.product_id);
                res.end();
              });
          }
        });
      } else res.end();
  });
});

// route to go into the queue to update bundles
app.get('/bundleupdate', (req, res) => {
  sqs.getQueue(queue => {
      db.getBundleId(parseInt(queue[queue.length-1].MessageAttributes.id.StringValue))
        .then(bundleId => {
          client.del(JSON.stringify(bundleId), (err, data) => {
            if (err) {
              console.error(`Unable to delete bundle: ${bundleId}`);
            } else {
              db.discontinuedProduct(parseInt(queue[queue.length-1].MessageAttributes.id.StringValue));
              sqs.sqs.deleteMessage( { QueueUrl: 'https://sqs.us-west-2.amazonaws.com/084821742333/NEW_PRODUCT', ReceiptHandle: queue[queue.length-1].ReceiptHandle }, (err, data) => {
                if (err) {
                  console.error('Error deleting message: ', err);
                } else if (data) {
                  console.log('Message deleted: ', parseInt(queue[queue.length-1].MessageAttributes.id.StringValue));
                }
              });
            }
          });
        });
  })
  .catch(err => {
    console.error('Error getting queue');
  });

  res.end();
});


// Connection to redis
client.on('connect', () => {
  console.log('Redis connected');
});

// Listen for the server
// app.listen(8080, () => {
//   console.log(`Listening on port 8080...`);
// });
const serve = port => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

serve(8000);
serve(8001);
serve(8002);
serve(8003);
serve(8004);
serve(8005);
serve(8006);
serve(8007);
serve(8008);
serve(8009);

module.exports = app;
