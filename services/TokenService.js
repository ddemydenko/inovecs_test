const jwt = require('jsonwebtoken');
const path = require('path');
const { promisify } = require('util');

const jwtVerify = promisify(jwt.verify);

const configPath = path.join(process.cwd(), './config/config.json');
const nconf = require('nconf').argv().env().file({ file: configPath });

class TokenService {
  constructor(config) {
    const auth = config.get('auth');
    if (!auth || !auth.secret) {
      throw new Error('Config data is incorrect');
    }

    this.auth = auth;
  }

  encodeToken(data) {
    const tokenData = Object.assign({}, data, { expirationDate: this.getExpirationDate() });
    const token = jwt.sign(tokenData, this.auth.secret);

    return Promise.resolve(token);
  }

  decodeToken(token) {
    return jwtVerify(token, this.auth.secret);
  }

  getExpirationDate() {
    const currentDate = new Date();
    const newMinutes = currentDate.getMinutes() + this.auth.sessionTimeout;
    return currentDate.setMinutes(newMinutes);
  }
}

module.exports = new TokenService(nconf);
