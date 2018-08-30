const CustomError = require('../services/CustomError');


const isEmail = (email) => {
// eslint-disable-next-line max-len
  const emailRegexp = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  if (!emailRegexp.test(email)) {
    throw new CustomError('Invalid email', 400);
  }
};

module.exports = {
  isEmail
};
