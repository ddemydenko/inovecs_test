const sinon = require("sinon");
const chai = require("chai");
chai.should();
chai.use(require('sinon-chai'));
chai.config.includeStack = false;

const proxyquire = require('proxyquire');
const { Deal, Message } = require('../../models');
const { destroyUsers, createUsers } = require('../helpers');


describe('Deal Service', () => {
  context('Create Deal', () => {
    let createDeal;
    let createMessage;
    let DealService;
    const theme = 'New Test Deal with unique number $2b$10$/g4gBdE.LxXfkaSq/JCQieRmyuoxyoVT0Kf3yrHzuGMfrZU9UFn3W';

    before(() => {
      createDeal = sinon.spy(Deal, 'create');
      createMessage = sinon.spy(Message, 'create');
      DealService = proxyquire('../../services/DealService', { Deal: createDeal, createMessage: Message });
      return destroyUsers().then(createUsers);
    });

    after(() => {
      createDeal.restore();
    });

    it('methods create deal and create message should only call once', () => {
      const data = {
        theme,
        message: 'Just message for test',
        amount: 10.5,
        receiverId: 2
      };
      const req = {
        authUser: { id: 1 },
        body: { data }
      };
      return DealService.create(req)
        .then(() => {
          return Boolean(createDeal.should.have.been.calledOnce && createMessage.should.have.been.calledOnce);
        });
    });
  });
});
