const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let nameParams = {
  QueueName: 'NEW_PRODUCT',
};

let queueURL = 'https://sqs.us-west-2.amazonaws.com/084821742333/NEW_PRODUCT';

// sqs.createQueue(nameParams, (err, data) => {
//   if (err) {
//     console.error('Error: ', err);
//   } else {
//     console.log('Success creating queue: ', data.QueueUrl);
//     queueUrl = data.QueueUrl;
//   }
// });

var sendParams = {
 DelaySeconds: 0,

 MessageAttributes: {
  "id": {
    DataType: "Number",
    StringValue: "151"
   },
 },
 MessageBody: "Information about discontinued product.",
 QueueUrl: queueURL
};

sqs.sendMessage(sendParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});
