const {
  User, Deal, Message, sequelize
} = require('../models');

module.exports = {
  destroyUsers() {
    return User.destroy({
      truncate: true, cascade: true
    }).then(() => {
      return sequelize.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    });
  },
  destroyDeals() {
    return Deal.destroy({
      truncate: true, cascade: true
    }).then(() => {
      return sequelize.query('ALTER SEQUENCE deals_id_seq RESTART WITH 1');
    });
  },
  createUsers() {
    return User.bulkCreate([
      {
        id: 1,
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce.wayne@example.com',
        password: '$2b$10$H54IcGd9tp/.B8mCdZc83O9V8rQctjK2u5k4TTDufGWigNf.86rbu'
      },
      {
        id: 2,
        firstName: 'Clark',
        lastName: 'Kent',
        email: 'clark.kent@example.com',
        password: '$2b$10$H54IcGd9tp/.B8mCdZc83O9V8rQctjK2u5k4TTDufGWigNf.86rbu'
      },
      {
        id: 3,
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'peter.parker@example.com',
        password: '$2b$10$H54IcGd9tp/.B8mCdZc83O9V8rQctjK2u5k4TTDufGWigNf.86rbu'
      }
    ]);
  },
  createDeals() {
    return Deal.bulkCreate([
      {
        id: 1,
        authorId: 1,
        theme: 'CD Reader',
        status: 'Open',
        message: 'Hi! I have a CD reader for you at discounted price',
        amount: 5.5,
        receiverId: 2,
        replyTo: 2
      },
      {
        id: 2,
        authorId: 3,
        theme: 'CD Reader',
        status: 'Open',
        message: 'Hi! I have a CD reader for you at discounted price',
        amount: 5.5,
        receiverId: 2,
        replyTo: 2
      }
    ]).then(() => {
      return Message.bulkCreate([
        {
          message: 'Hi! I have a CD reader for you at discounted price',
          authorId: 1,
          amount: 5.5,
          dealId: 1
        },
        {
          message: 'Hi! I have a CD reader for you at discounted price',
          authorId: 3,
          amount: 5.5,
          dealId: 2
        }
      ]);
    });
  }
};
