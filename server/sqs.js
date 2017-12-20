const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let queueURL = 'https://sqs.us-west-2.amazonaws.com/084821742333/NEW_PRODUCT';

let getUrl = () => {
  let params = {
    QueueName: 'NEW_PRODUCT',
  }

  sqs.getQueueURL(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success getting url: ', data.QueueUrl);
      queueURL = data.QueueUrl;
    }
  });
}

let getQueue = (callback) => {
  let params = {
   AttributeNames: [
      "All"
   ],
   MaxNumberOfMessages: 1,
   MessageAttributeNames: [
      "All"
   ],
   QueueUrl: queueURL,
   VisibilityTimeout: 0,
   WaitTimeSeconds: 0
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      callback(data.Messages);
    }
  });
}

exports.sqs = sqs;
// exports.getURL = getURL;
exports.getQueue = getQueue;
// exports.queueURL = queue;
