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
  signin(req) {
    const { data } = req.body;
    let userData;
    isEmail(data.email);

    return User.findOne({
      attributes: ['id', 'password', 'email', 'firstName'],
      where: { email: data.email },
    })
      .then((user) => {
        if (!user) {
          throw new CustomError(`User with email: ${data.email} is not enrolled`, 404);
        } else {
          userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName
          };
          return cryptCompare(data.password, user.password);
        }
      })
      .then((passwordMatch) => {
        if (passwordMatch) {
          return TokenService.encodeToken(userData).then(token => ({ token }));
        }
        throw new CustomError('Unauthorized Access. Password does not match', 401);
      });
  }

  signup(req) {
    const {
      firstName, email, password, lastName
    } = req.body.data;

    isEmail(email);

    return User.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { email },
    })
      .then((user) => {
        if (!user) {
          return cryptHash(password, 10);
        }
        throw new CustomError(`User with email: ${email} already enrolled`, 409);
      })
      .then((hash) => {
        return User.create({
          firstName,
          lastName,
          email,
          password: hash
        });
      })
      .then(user => ({ registrationId: user.id }));
  }
}

module.exports = new AuthService();
