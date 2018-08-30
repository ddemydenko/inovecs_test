module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define('Deal',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        field: 'author_id',
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        field: 'receiver_id',
        allowNull: false,
      },
      theme: {
        type: DataTypes.STRING,
        field: 'theme',
      },
      status: {
        type: DataTypes.ENUM,
        values: ['Open', 'Closed'],
        field: 'status',
      },
      // which user have to answer. flag to avoid answer to own messages
      replyTo: {
        type: DataTypes.INTEGER,
        field: 'reply_to',
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
      tableName: 'deals',
    });

  return Deal;
};
