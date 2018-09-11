const { User } = require('../models');
const CustomError = require('../services/CustomError');

class UserService {
  list() {
    return User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName']
    })
      .then((users) => {
        if (!users.length) {
          throw new CustomError('No one users are registered', 404);
        } else {
          return users;
        }
      });
  }
}

module.exports = new UserService();
