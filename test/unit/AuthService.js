const sinon = require("sinon");
const chai = require("chai");
chai.should();
chai.use(require('sinon-chai'));
const expect = chai.expect;

const proxyquire = require('proxyquire');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const cryptCompare = promisify(bcrypt.compare);
const { User } = require('../../models');
const { destroyUsers } = require('../helpers');

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
      // return destroyUsers();
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
  context('Email validation', () => {
    const { isEmail } = require('../../services/Utils');
    const CustomError = require('../../services/CustomError');
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
