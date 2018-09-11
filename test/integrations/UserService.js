const chai = require("chai");
chai.should();
chai.use(require('chai-http'));
const { destroyUsers, destroyDeals, createUsers, createDeals } = require('../helpers');

describe('/users', () => {
  let app;
  let startTime;
  before(() => {
    app = require('../../server');
    startTime = new Date();
    return destroyUsers().then(destroyDeals).then(createUsers);
  });

  after(() => {

  });

  context('/users', () => {
    it('should create deal with correct data', () => {
      return chai.request(app)
        .get('/users')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          const { body } = res;
          body.should.be.an('array');
          const user = body.shift();

          user.should.have.property('id').satisfy(Number.isInteger);
          user.should.have.property('firstName').to.be.a('string');
          user.should.have.property('lastName').to.be.a('string');

          return res.should.have.status(200);
        })
    });

  });

})
