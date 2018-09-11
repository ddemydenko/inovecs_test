// return;
const chai = require("chai");
chai.should();
chai.use(require('chai-http'));
const { destroyUsers, destroyDeals, createUsers, createDeals } = require('../helpers');

describe('/deals', () => {
  let app;
  let startTime;
  before(() => {
    app = require('../../server');
    startTime = new Date();
    return destroyUsers().then(destroyDeals).then(createUsers);
  });

  after(() => {

  });

  context('/create', () => {
    it('should create deal with correct data', () => {
      return chai.request(app)
        .post('/deals/create')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .send({ data: {
            theme: "CD Reader",
            message: "Hi! I have a CD reader for you at discounted price",
            amount: 5.5,
            receiverId: 2
        } })
        .then((res) => {
          const { body } = res;
          body.should.have.property('id').satisfy(Number.isInteger);
          body.should.have.property('authorId', 1);
          body.should.have.property('theme', 'CD Reader');
          body.should.have.property('receiverId', 2);
          body.should.have.property('status', 'Open');
          body.should.have.property('replyTo', 2);
          body.should.have.property('updatedAt');
          (new Date(body.updatedAt)).should.gt(startTime);
          body.should.have.property('createdAt');
          (new Date(body.createdAt)).should.gt(startTime);
          body.should.have.property('deletedAt').to.be.null;

          return res.should.have.status(200);
        })
    });

    it('should throw Error when try to create deal with yourself', () => {
      return chai.request(app)
        .post('/deals/create')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .send({ data: {
            theme: "CD Reader",
            message: "Hi! I have a CD reader for you at discounted price",
            amount: 0,
            receiverId: 1
          } })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 400,
            message: "You can't send message to yourself"
          });

          return res.should.have.status(400);
        })
    });




  });

  context('/reply', () => {
    it("should create message and not to change status of deal when user have not provided status", () => {
      return chai.request(app)
        .post('/deals/reply')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjbGFyay5rZW50QGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiQ2xhcmsiLCJleHBpcmF0aW9uRGF0ZSI6MTU3MjY3ODQxODg5NywiaWF0IjoxNTM2Njc0ODE4fQ.hbT7AilTZU09QdSTXqdadfxod-YkM_Z6sTvyVuDhvY0')
        .send({ data: {
            dealId: 1,
            message: "Test message for reply without status",
            amount: 5.5,
            receiverId: 2
          } })
        .then((res) => {
          const { body } = res;
          body.should.have.property('id').satisfy(Number.isInteger);
          // body.should.have.property('authorId', 1);
          body.should.have.property('receiverId', 2);
          body.should.have.property('status', 'Open');
          body.should.have.property('replyTo', 1);
          body.should.have.property('updatedAt');
          (new Date(body.updatedAt)).should.gt(startTime);
          body.should.have.property('createdAt');
          (new Date(body.createdAt)).should.gt(startTime);
          body.should.have.property('deletedAt').to.be.null;

          return res.should.have.status(200);
        })
    });


    it('should create message and close deal with Accept status', () => {
      return chai.request(app)
        .post('/deals/reply')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .send({ data: {
            dealId: 1,
            action: "Accept",
            message: "Test message for reply with accept",
            amount: 5.5,
            receiverId: 2
          } })
        .then((res) => {
          const { body } = res;
          body.should.have.property('id').satisfy(Number.isInteger);
          // body.should.have.property('authorId', 1);
          body.should.have.property('receiverId', 2);
          body.should.have.property('status', 'Closed');
          body.should.have.property('replyTo', 2);
          body.should.have.property('updatedAt');
          (new Date(body.updatedAt)).should.gt(startTime);
          body.should.have.property('createdAt');
          (new Date(body.createdAt)).should.gt(startTime);
          body.should.have.property('deletedAt').to.be.null;

          return res.should.have.status(200);
        })
    });


    it('should throw Error when try to reply to yourself', () => {
      return chai.request(app)
        .post('/deals/reply')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .send({ data: {
            dealId: 1,
            action: "Accept",
            message: "Test message for reply with accept",
            amount: 5.5,
            receiverId: 1
          } })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 400,
            message: "Reply can only receiver"
          });

          return res.should.have.status(400);
        })
    });

    it('should throw Error when try to reply to closed deal', () => {
      return chai.request(app)
        .post('/deals/reply')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjbGFyay5rZW50QGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiQ2xhcmsiLCJleHBpcmF0aW9uRGF0ZSI6MTU3MjY3ODQxODg5NywiaWF0IjoxNTM2Njc0ODE4fQ.hbT7AilTZU09QdSTXqdadfxod-YkM_Z6sTvyVuDhvY0')
        .send({ data: {
            dealId: 1,
            action: "Accept",
            message: "Test message for reply with accept",
            amount: 5.5,
            receiverId: 1
          } })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 400,
            message: "You can't reply for closed deal"
          });

          return res.should.have.status(400);
        })
    });

    it('should throw Error when provided wrong deal id', () => {
      return chai.request(app)
        .post('/deals/reply')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjbGFyay5rZW50QGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiQ2xhcmsiLCJleHBpcmF0aW9uRGF0ZSI6MTU3MjY3ODQxODg5NywiaWF0IjoxNTM2Njc0ODE4fQ.hbT7AilTZU09QdSTXqdadfxod-YkM_Z6sTvyVuDhvY0')
        .send({ data: {
            dealId: -1,
            action: "Accept",
            message: "Test message for reply with accept",
            amount: 5.5,
            receiverId: 1
          } })
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 404,
            message: 'Deal not found'
          });

          return res.should.have.status(404);
        })
    });

  });

  context('/deals', () => {

    before(() => {
      app = require('../../server');
      startTime = new Date();
      return destroyDeals().then(createDeals);
    });


    it("should return correct deals objects", () => {
      return chai.request(app)
        .get('/deals')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          const { body } = res;
          body.should.be.an('array');
          const deal = body.shift();

          deal.should.have.property('id').satisfy(Number.isInteger);
          deal.should.have.property('author').an('object');
          deal.author.should.have.property('firstName').to.be.a('string');
          deal.author.should.have.property('lastName').to.be.a('string');
          deal.should.have.property('theme').to.be.a('string');
          deal.should.have.property('status').to.be.oneOf(['Closed', 'Open']);
          deal.should.have.property('createdAt');
          (new Date(deal.createdAt)).should.gt(startTime);

          return res.should.have.status(200);
        })
    });

    it("should return correct single deal object", () => {
      return chai.request(app)
        .get('/deals/1')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          const { body } = res;

          body.should.have.property('id').satisfy(Number.isInteger);
          body.should.have.property('author').an('object');
          body.author.should.have.property('firstName').to.be.a('string');
          body.author.should.have.property('lastName').to.be.a('string');
          body.should.have.property('theme').to.be.a('string');
          body.should.have.property('status').to.be.oneOf(['Closed', 'Open']);
          body.should.have.property('createdAt');
          (new Date(body.createdAt)).should.gt(startTime);

          body.messages.should.be.an('array');
          const message = body.messages.shift();

          message.should.have.property('id').satisfy(Number.isInteger);
          message.should.have.property('author').an('object');
          message.author.should.have.property('firstName').to.be.a('string');
          message.author.should.have.property('lastName').to.be.a('string');
          message.should.have.property('createdAt');
          (new Date(message.createdAt)).should.gt(startTime);

          return res.should.have.status(200);
        })
    });

    it("should throw Error when user try access to foreign deal", () => {
      return chai.request(app)
        .get('/deals/2')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 401,
            message: "You can't see this deal"
          });

          return res.should.have.status(401);
        })
    });

    it("should throw Error when user try access to not exists deal", () => {
      return chai.request(app)
        .get('/deals/999999999')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          res.body.should.have.property('error').eql({
            status: 404,
            message: "Deal not found"
          });

          return res.should.have.status(404);
        })
    });

    it("should return correct detailed deals objects", () => {
      return chai.request(app)
        .get('/deals')
        .query({ detail: true })
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
        .then((res) => {
          const { body } = res;
          body.should.be.an('array');
          const deal = body.shift();

          deal.should.have.property('id').satisfy(Number.isInteger);
          deal.should.have.property('author').an('object');
          deal.author.should.have.property('firstName').to.be.a('string');
          deal.author.should.have.property('lastName').to.be.a('string');
          deal.should.have.property('theme').to.be.a('string');
          deal.should.have.property('status').to.be.oneOf(['Closed', 'Open']);
          deal.should.have.property('createdAt');
          (new Date(deal.createdAt)).should.gt(startTime);

          deal.messages.should.be.an('array');
          const message = deal.messages.shift();

          message.should.have.property('id').satisfy(Number.isInteger);
          message.should.have.property('author').an('object');
          message.author.should.have.property('firstName').to.be.a('string');
          message.author.should.have.property('lastName').to.be.a('string');
          message.should.have.property('createdAt');
          (new Date(message.createdAt)).should.gt(startTime);

          return res.should.have.status(200);
        })
    });

    it("should throw Error when no deals exists", () => {
      return destroyDeals().then(() => {
        return chai.request(app)
          .get('/deals')
          .query({ status: 'Open' })
          .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicnVjZS53YXluZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkJydWNlIiwiZXhwaXJhdGlvbkRhdGUiOjE4OTY2NzQ4ODMyNjYsImlhdCI6MTUzNjY3MTI4M30.o0cUI1oGgTcI1v2TwPClKKGGPUcoGyrsIaC2NoE3VCU')
          .then((res) => {
            res.body.should.have.property('error').eql({
              status: 404,
              message: "No one deals are created"
            });

            return res.should.have.status(404);
          });
      });

    });
  });
})
