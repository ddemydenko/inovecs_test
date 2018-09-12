const bcrypt = require('bcrypt');
const { promisify } = require('util');

const cryptHash = promisify(bcrypt.hash);
const cryptCompare = promisify(bcrypt.compare);

const { User } = require('../models');
const { isEmail } = require('../services/Utils');
const CustomError = require('../services/CustomError');
const TokenService = require('../services/TokenService');


// it must be wrapper on third party auth service, i.e. cognito etc.
class AuthService {
  // Login
  async signin(req) {
    const { data } = req.body;
    isEmail(data.email);

    const user = await User.findOne({
      attributes: ['id', 'password', 'email', 'firstName'],
      where: { email: data.email },
    });

    if (!user) {
      throw new CustomError(`User with email: ${data.email} is not enrolled`, 404);
    }
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName
    };
    const passwordMatch = await cryptCompare(data.password, user.password);

    if (passwordMatch) {
      return TokenService.encodeToken(userData).then(token => ({ token }));
    }
    throw new CustomError('Unauthorized Access. Password does not match', 401);
  }

  async signup(req) {
    const {
      firstName, email, password, lastName
    } = req.body.data;

    isEmail(email);

    const findUser = await User.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { email },
    });

    if (findUser) {
      throw new CustomError(`User with email: ${email} already enrolled`, 409);
    }
    const hash = await cryptHash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash
    });

    return { registrationId: user.id };
  }
}

module.exports = new AuthService();
