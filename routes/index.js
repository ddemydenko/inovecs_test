const { Router } = require('express');

const appRouter = new Router();
const AuthService = require('../services/AuthService');
const UserService = require('../services/UserService');
const DealService = require('../services/DealService');

const {
  reply,
  list,
  create,
  get
} = DealService;

const appRoutes = [
  {
    method: 'get',
    path: '/users',
    handler: UserService.list,
  },
  {
    method: 'get',
    path: '/deals',
    handler: list.bind(DealService),
  },
  {
    method: 'post',
    path: '/deals/reply',
    handler: reply.bind(DealService)
  },
  {
    method: 'get',
    path: '/deals/:id',
    handler: get.bind(DealService)
  },
  {
    method: 'post',
    path: '/deals/create',
    handler: create.bind(DealService),
  },
  {
    method: 'post',
    path: '/auth/signup',
    handler: AuthService.signup,
  },
  {
    method: 'post',
    path: '/auth/signin',
    handler: AuthService.signin,
  }
];

const initRoutes = ({ method, path, handler }) => {
  return appRouter[method](
    path,
    (req, res, next) => {
      const result = handler(req);

      if (!result) {
        next(new Error(`Request data is ${result}.`));
      }

      if (typeof result.then === 'function') {
        result.then((data) => {
          res.send(data);
          next();
        }).catch((err) => {
          next(err);
        });
      } else {
        res.send(result);
        next();
      }
    }
  );
};


appRoutes.map(initRoutes);

module.exports = {
  appRouter
};
