const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const ymlRawPath = '/api/swagger/swagger.yaml';
const ymlPath = `${process.cwd()}${ymlRawPath}`;
const swaggerDocument = YAML.load(ymlPath);
const CustomError = require('../services/CustomError');

const TokenService = require('./TokenService');

const setupSwaggerUi = (app) => {
  return (req, res, next) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    next();
  };
};

const authCheck = () => {
  return (req, res, next) => {
    // console.log(req);
    const token = req.get('Authorization');
    // token needed validated above, in swagger validation requests
    if (!token) {
      return Promise.resolve(next());
    }
    return TokenService.decodeToken(token)
      .then((decoded) => {
        if (!decoded) {
          next(new CustomError('Missing auth token', 401));
        } else if (!decoded.expirationDate || decoded.expirationDate < new Date()) {
          next(new CustomError('Session expired', 401));
        } else {
          req.authUser = decoded;
          next();
        }
      }).catch((err) => {
        next(new CustomError(`${err.name} ${err.message}`, 401));
      });
  };
};

// security trick
const preventShowStackTrace = () => {
  return (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  };
};


module.exports = {
  setupSwaggerUi,
  swaggerDocument,
  preventShowStackTrace,
  authCheck
};
