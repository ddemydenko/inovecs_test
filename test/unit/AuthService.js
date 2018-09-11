const sinon = require("sinon");
const chai = require("chai");
chai.should();
chai.use(require('sinon-chai'));

const proxyquire = require('proxyquire');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const cryptCompare = promisify(bcrypt.compare);
const { User } = require('../../models');
const { destroyUsers, createUsers } = require('../helpers');
const CustomError = require('../../services/CustomError');


describe('Auth Service', () => {
  context('Sign Up', () => {
    let createUser;
    let AuthService;

    before(() => {
      const req = {
        body: {
          data: {
            firstName: 'Bruce',
            lastName: 'Wayne',
            email: 'bruce.wayne@example.com',
            password: '12345'
          }
        }
      };
      createUser = sinon.spy(User, 'create');
      AuthService = proxyquire('../../services/AuthService', { User: createUser });
      return destroyUsers()
        .then(() => AuthService.signup(req));
    });

    after(() => {
      createUser.restore();
    });

    it('should only call the create method once with correct arguments', () => {
      createUser.should.have.been.calledOnce
        .and.been.calledWith(
        sinon.match({
          firstName: 'Bruce',
          lastName: 'Wayne',
          email: 'bruce.wayne@example.com'
        }));
    });

    it('should properly save to database', () => {
      return createUser.returnValues[0]
        .then((data) => {
          const user = data.get();
          user.should.to.have.property('firstName','Bruce');
          user.should.to.have.property('lastName','Wayne');
          user.should.to.have.property('email','bruce.wayne@example.com');
          return Promise.resolve();
        })
    });

    it('should encrypt password correctly', () => {
      return createUser.returnValues[0]
        .then((data) => {
          const user = data.get();
          return cryptCompare('12345', user.password);
        })
        .then((check) => {
          check.should.be.true;
          return Promise.resolve();
        });
    });
  });

  context('Sign In', () => {
    let findUser;
    let AuthService;

    before(() => {
      const req = {
        body: {
          data: {
            email: 'bruce.wayne@example.com',
            password: '12345'
          }
        }
      };
      findUser = sinon.spy(User, 'findOne');
      AuthService = proxyquire('../../services/AuthService', { User: findUser });
      return destroyUsers().then(createUsers).then(() => AuthService.signin(req));

    });

    after(() => {
      findUser.restore();
    });

    it('should only call the findOne method once with correct arguments', () => {
      findUser.should.have.been.calledOnce
        .and.been.calledWith(
        sinon.match({
          attributes: ['id', 'password', 'email', 'firstName'],
          where: { email: 'bruce.wayne@example.com' }
        }));
    });

    it('should properly get from database', () => {
      return findUser.returnValues[0]
        .then((data) => {
          const user = data.get();
          user.should.eql({
            id: 1,
            password: '$2b$10$H54IcGd9tp/.B8mCdZc83O9V8rQctjK2u5k4TTDufGWigNf.86rbu',
            firstName: 'Bruce',
            email: 'bruce.wayne@example.com',
          });

          return Promise.resolve();
        })
    });
  });

  context('Email validation', () => {
    const { isEmail } = require('../../services/Utils');
    const isEmailSpy = sinon.spy(isEmail);

    it('should passing check with valid email', (done) => {
      isEmail('bruce.wayne@example.com');
      done();
    });

    it('should throw CustomError with invalid email', () => {
      isEmailSpy.should.to.throw(CustomError, 'Invalid email');
    });
  });
});
