module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dealId: {
        type: DataTypes.INTEGER,
        field: 'deal_id',
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        field: 'first_name',
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        field: 'author_id',
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM,
        values: ['Accept', 'Reject', 'Request'],
        field: 'action',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      tableName: 'messages',
    });
  Message.associate = ({ Deal, User }) => {
    Deal.hasMany(Message, {
      foreignKey: 'dealId',
      as: 'messages',
    });
    User.hasMany(Message, {
      foreignKey: 'authorId',
      as: 'authors',
    });
  };

  return Message;
};
