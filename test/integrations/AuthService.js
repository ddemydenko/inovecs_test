const chai = require('chai');

chai.should();
chai.use(require('chai-http'));
const { destroyUsers } = require('../helpers');
const app = require('../../server');

describe('/users', () => {
  before(() => {
    return destroyUsers();
  });

  after(() => {

  });

  context('Sign Up', () => {
    it('should sign up with correct email', () => {
      return chai.request(app)
        .post('/auth/signup')
        .send({
          data: {
            email: 'bruce.wayne@example.com',
            firstName: 'Bruce',
            password: '12345'
          }
        })
        .then((res) => {
          return res.should.have.status(200);
        });
    });

    it('should not sign up if user already exists', () => {
      return chai.request(app)
        .post('/auth/signup')
        .send({
          data: {
            email: 'bruce.wayne@example.com',
            firstName: 'Clark',
            password: '12345'
          }
        })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 409,
            message: 'User with email: bruce.wayne@example.com already enrolled'
          });
          return res.should.have.status(409);
        });
    });

    it('should not sign up with incorrect email', () => {
      return chai.request(app)
        .post('/auth/signup')
        .send({
          data: {
            email: 'bruce.wayne@@example.com',
            firstName: 'Clark',
            password: '12345'
          }
        })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 400,
            message: 'Invalid email'
          });
          return res.should.have.status(400);
        });
    });
  });

  context('Sign In', () => {
    it('should sign in with correct email and password', () => {
      return chai.request(app)
        .post('/auth/signin')
        .send({
          data: {
            email: 'bruce.wayne@example.com',
            firstName: 'Bruce',
            password: '12345'
          }
        })
        .then((res) => {
          return res.should.have.status(200);
        });
    });

    it('should not sign in with incorrect email', () => {
      return chai.request(app)
        .post('/auth/signin')
        .send({
          data: {
            email: 'bruce.wayne@@example.com',
            firstName: 'Clark',
            password: '12345'
          }
        })
        .then((res) => {
          return res.should.have.status(400);
        });
    });

    it('should not sign in with incorrect password', () => {
      return chai.request(app)
        .post('/auth/signin')
        .send({
          data: {
            email: 'bruce.wayne@example.com',
            password: '123456'
          }
        })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 401,
            message: 'Unauthorized Access. Password does not match'
          });

          return res.should.have.status(401);
        });
    });

    it('should not sign in with unregistered email', () => {
      return chai.request(app)
        .post('/auth/signin')
        .send({
          data: {
            email: 'fake.bruce.wayne@example.com',
            password: '12345'
          }
        })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 404,
            message: 'User with email: fake.bruce.wayne@example.com is not enrolled'
          });

          return res.should.have.status(404);
        });
    });
  });
});
