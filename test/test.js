const bundlin = require('../server/bundlin.js');
const request = require('supertest');
const app = require('../server/index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const faker = require('faker');

chai.use(chaiHttp);

describe('App', () => {
  describe('/bundleref', () => {

    it('responds with status 200', done => {
      let randomId = Math.floor(Math.random() * (50000 - 1 + 1)) + 1;
      chai.request(app)
        .get(`/bundleref?product_id=${randomId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
        });
      done();
    });

    it('returns all items in the associated bundle', done => {
      let results = [
        { id: 1116,
          product_name: 'Handcrafted Concrete Chicken',
          product_description: 'Ipsam error et est ducimus dolores voluptatem.',
          product_image: 'http://lorempixel.com/640/480/abstract',
          category: 'Music',
          price: '108',
          inventory_count: 2157,
          createdAt: '2017-12-12T23:43:46.816Z',
          updatedAt: '2017-12-12T23:43:46.816Z' },
        { id: 2114,
          product_name: 'Sleek Soft Sausages',
          product_description: 'Voluptates inventore temporibus.',
          product_image: 'http://lorempixel.com/640/480/sports',
          category: 'Kids',
          price: '805',
          inventory_count: 14288,
          createdAt: '2017-12-12T23:43:46.882Z',
          updatedAt: '2017-12-12T23:43:46.882Z' },
        { id: 2082224,
          product_name: 'Awesome Granite Sausages',
          product_description: 'Quasi earum dolor.',
          product_image: 'http://lorempixel.com/640/480/sports',
          category: 'Movies',
          price: '519',
          inventory_count: 58000,
          createdAt: '2017-12-19T00:36:14.683Z',
          updatedAt: '2017-12-19T00:36:14.683Z' },
        { id: 8127676,
          product_name: 'Rustic Granite Salad',
          product_description: 'A vitae ex earum est laboriosam.',
          product_image: 'http://lorempixel.com/640/480/animals',
          category: 'Grocery',
          price: '260',
          inventory_count: 2237,
          createdAt: '2017-12-19T00:39:49.257Z',
          updatedAt: '2017-12-19T00:39:49.257Z' }
        ]

      chai.request(app)
        .get(`/bundleref?product_id=2114`)
        .end((err, res) => {
          expect(res.body).to.deep.own.include(results);
        });
      done();
    });
  });

  describe('/createbundle', () => {

    it('responds with status 201', done => {
      let bundleName = faker.commerce.product();
      let itemIds = [];
      let productAmount = Math.floor(Math.random() * (11 - 3 + 1)) + 3;

      for (var i = 0; i < productAmount; i++) {
        itemIds.push(Math.floor(Math.random() * (10626948 - 1 + 1)) + 1);
      }

      chai.request(app)
        .post(`/createbundle`)
        .send({ bundleName, itemIds })
        .end((err, res) => {
          expect(res).to.have.status(201);
        });
      done();
    });

    it('sends to the body', done => {
      let bundleName = faker.commerce.product();
      let itemIds = [];
      let productAmount = Math.floor(Math.random() * (11 - 3 + 1)) + 3;

      for (var i = 0; i < productAmount; i++) {
        itemIds.push(Math.floor(Math.random() * (10626948 - 1 + 1)) + 1);
      }

      chai.request(app)
        .post('/createbundle')
        .send({ bundleName, itemIds })
        .end((err, res) => {
          expect(res.request._data).to.include({ bundleName, itemIds });
        });
        done();
    });
  });

  describe('/bundleupdate', () => {
    it('responds with status 200', done => {
      chai.request(app)
        .get(`/bundleupdate`)
        .end((err, res) => {
          expect(res).to.have.status(200);
        });
      done();
    });
  });
});
