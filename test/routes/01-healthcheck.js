'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


let server = require('../../index');
let requester = chai.request(server);

describe('Test Healthcheck', () => {
  describe('GET /liveness', () => {
    it('should return 200', done => {
      requester.get('/liveness')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200);
          done();
        });
    });
  });
  describe('GET /readyness', () => {
    it('should return 200 with an empty arrays of errors', done => {
      requester.get('/readyness')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res.body).to.be.an('object').and.have.property('errors');
          expect(res.body.errors).to.be.an('array').and.have.property('length', 0);
          done();
        });
    });
  });
});
