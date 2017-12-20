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
      for (var i = 0; i < 1; i++) {
        let randomId = Math.floor(Math.random() * (50000 - 1 + 1)) + 1;
        chai.request(app)
          .get(`/bundleref?product_id=${randomId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
          });
      }
      done();
    });
  });

  // describe('/createbundle', () => {
  //   it('responds with status 201', done => {
  //     //for (var i = 0; i < 10000; i++) {
  //       let bundleName = faker.hacker.noun();
  //       let randomId = Math.floor(Math.random() * (126948 - 1 + 1)) + 1;
  //       chai.request(app)
  //         .post(`/createbundle?bundleName=${bundleName}&productId=${randomId}`)
  //         .end((err, res) => {
  //           expect(res).to.have.status(201);
  //         });
  //     //}
  //     done();
  //   });
  // })
});
