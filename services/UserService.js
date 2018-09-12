const { User } = require('../models');
const CustomError = require('../services/CustomError');

class UserService {
  async list() {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName']
    });

    if (!users.length) {
      throw new CustomError('No one users are registered', 404);
    }
    return users;
  }
}

module.exports = new UserService();
