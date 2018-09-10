const sinon = require("sinon");
const chai = require("chai");
chai.should();
chai.use(require('sinon-chai'));

const proxyquire = require('proxyquire');
const { User } = require('../../models');
const { destroyUsers } = require('../helpers');

describe('Auth Service', () => {
  context('Sign Up', () => {
    let createUser;
    let AuthService;

    before(() => {
      createUser = sinon.spy(User, 'create');
      AuthService = proxyquire('../../services/AuthService', { User: createUser });
      return destroyUsers();
    });

    after(() => {
      createUser.restore();
      return destroyUsers();
    });

    it('should only call the create method once', () => {
      const data = {
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce_wayne@example.com',
        password: '12345'
      };
      const req = {
        body: { data }
      }
      return AuthService.signup(req)
        .then(() => {
          return createUser.should.have.been.calledOnce;
        });
    });
  });
});
