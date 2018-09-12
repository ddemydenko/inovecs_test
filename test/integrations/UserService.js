const chai = require('chai');

chai.should();
chai.use(require('chai-http'));
const { destroyUsers, createUsers } = require('../helpers');
const app = require('../../server');

describe('/users', () => {
  before(() => {
    return destroyUsers().then(createUsers);
  });

  after(() => {

  });

  context('/users', () => {
    it('should return users with correct data', () => {
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
        });
    });

    it('should throw Error when no one users are registered', () => {
      return destroyUsers()
        .then(() => chai.request(app)
          .get('/users')
          .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU'))
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 404,
            message: 'No one users are registered'
          });

          return res.should.have.status(404);
        });
    });

    it('should throw Error when try to access with expired token', () => {
      return chai.request(app)
        .get('/users')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE1MzY3MDIxMjc1NzYsImlhdCI6MTUzNjcwMjA2N30.jhCAk6aRdclbmTyPUmXkAZOC2WgAjM6xJtI6bPf4xnQ')
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 401,
            message: 'Session expired'
          });
          return res.should.have.status(401);
        });
    });
  });
});
