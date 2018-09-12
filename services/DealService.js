const path = require('path');

const configPath = path.join(process.cwd(), './config/config.json');
const nconf = require('nconf').argv().env().file({ file: configPath });
const {
  Deal, Message, User, sequelize
} = require('../models');
const CustomError = require('../services/CustomError');

const DEAL_STATUSES = {
  OPEN: 'Open',
  CLOSED: 'Closed'
};

const DEAL_ACTIONS = {
  ACCEPT: 'Accept',
  REJECT: 'Reject',
  REQUEST: 'Request'
};

class DealService {
  /**
   * @param req.authUser decoded token from mw
   * @desc create new Deal with first message
   * @returns {Object} {@link Deal}
   */
  async create(req) {
    const {
      receiverId, theme, amount, message
    } = req.body.data;

    if (req.authUser.id === receiverId) {
      throw new CustomError('You can\'t send message to yourself', 400);
    }

    return sequelize.transaction(async (t) => {
      const deal = await Deal.create({
        authorId: req.authUser.id,
        theme,
        receiverId,
        status: DEAL_STATUSES.OPEN,
        replyTo: receiverId
      }, { transaction: t });

      await Message.create({
        message,
        authorId: req.authUser.id,
        amount,
        action: DEAL_ACTIONS.REQUEST,
        dealId: deal.id
      }, { transaction: t });

      return deal;
    });
  }


  async reply(req) {
    const {
      action, amount, message, dealId
    } = req.body.data;

    const deal = await Deal.findOne({
      attributes: ['id', 'theme', 'replyTo', 'status', 'authorId', 'receiverId', 'createdAt', 'updatedAt'],
      where: { id: dealId },
    });

    if (!deal) {
      throw new CustomError('Deal not found', 404);
    }
    if (deal.replyTo !== req.authUser.id) {
      throw new CustomError('Reply can only receiver', 400);
    }
    if (deal.status === DEAL_STATUSES.CLOSED) {
      throw new CustomError('You can\'t reply for closed deal', 400);
    }
    const replyTo = req.authUser.id === deal.authorId ? deal.receiverId : deal.authorId;

    await Message.create({
      message,
      authorId: req.authUser.id,
      amount,
      action,
      dealId: deal.id
    });

    const dealData = { replyTo };

    if ([DEAL_ACTIONS.REJECT, DEAL_ACTIONS.ACCEPT].includes(action)) {
      dealData.status = DEAL_STATUSES.CLOSED;
    }

    return Deal.update(dealData, { where: { id: dealId }, returning: true })
      .then(([count, rows]) => rows[0]);
  }

  async get(req) {
    const {
      id
    } = req.params;

    const deal = await Deal.findOne({
      attributes: ['id', 'theme', 'replyTo', 'status', 'receiverId', 'authorId', 'createdAt', 'updatedAt'],
      where: { id },
      include: [
        {
          model: Message,
          as: 'messages',
          attributes: ['id', 'message', 'authorId', 'action', 'createdAt'],
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName']
          }]
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!deal) {
      throw new CustomError('Deal not found', 404);
    }
    if (![deal.authorId, deal.receiverId].includes(req.authUser.id)) {
      throw new CustomError("You can't see this deal", 401);
    }

    return deal;
  }


  /**
   * @param req.authUser decoded token from mw
   * @desc gets only own deals, applies filter by creator
   * @returns {Deal[]}
   */
  async list(req) {
    const {
      status,
      page = 1,
      detail = false,
      limit = nconf.get('pagination:defaultLimit')
    } = req.query;

    const offset = limit * (page - 1);

    const where = { $or: [] };
    where.$or.push({ authorId: req.authUser.id });
    where.$or.push({ receiverId: req.authUser.id });
    if (status) {
      where.status = status;
    }

    const include = [{
      model: User,
      as: 'author',
      attributes: ['id', 'firstName', 'lastName']
    }];
    if (detail) {
      include.push({
        model: Message,
        as: 'messages',
        attributes: ['id', 'message', 'action', 'createdAt'],
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName']
        }]
      });
    }

    const deals = await Deal.findAll({
      attributes: ['id', 'authorId', 'theme', 'status', 'createdAt', 'updatedAt'],
      where,
      include,
      offset,
      limit
    });

    if (!deals.length) {
      throw new CustomError('No one deals are created', 404);
    }
    return deals;
  }
}

module.exports = new DealService();
