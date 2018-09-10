const { User } = require('../models');

module.exports = {
  destroyUsers() {
    return User.destroy({
      truncate: true, cascade: true,
      where: { email: 'bruce_wayne@example.com' }
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
      }
    ]);
  }
}
