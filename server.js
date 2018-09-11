const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const middleware = require('swagger-express-middleware');

const { appRouter } = require('./routes');
const {
  setupSwaggerUi, preventShowStackTrace, swaggerDocument, authCheck
} = require('./services/Middlware');

const PORT = process.env.NODE_PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(setupSwaggerUi(app));

middleware(swaggerDocument, app, (error, middleWare) => {
  app.use(
    middleWare.metadata(),
    middleWare.CORS(),
    middleWare.parseRequest(),
    middleWare.validateRequest()
  );

  app.use(authCheck());
  app.use('/', appRouter);


  app.use((err, req, res, next) => {
    //todo use this logger like winston or similar
    if(process.env.NODE_ENV === 'development'){
      console.error(err.stack);
    }
    err.status = err.status || 500;
    res.status(err.status);
    res.send({
      error: {
        status: err.status,
        message: err.message
      }
    });
  });

  app.use(preventShowStackTrace());
});

app.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log('Server is running on Port', PORT);
});

module.exports = app;
