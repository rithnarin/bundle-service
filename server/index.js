const express = require('express');
const Sequelize = require('sequelize');
const db = require('../database/postgres.js');
const bodyParser = require('body-parser');

//require('../database/saveFakeData.js');

let app = express();

app.use(bodyParser.json());

app.post('/createbundle', (req, res) => {

});

app.get('/bundleref', (req, res) => {

});

app.listen(5000, () => {
  console.log(`Listening on port 5000...`);
});
