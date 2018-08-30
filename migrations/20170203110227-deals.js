const tableName = 'deals';
const userTable = 'users';

module.exports = {
  up: (queryInterface, DataTypes) => {
    const opts = {
      charset: 'utf-8',
      schema: 'public',
      underscored: true,
    };

    return queryInterface.createTable(tableName, {
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
    }, opts).then(() => {
      return queryInterface.addConstraint(tableName, ['author_id'], {
        type: 'foreign key',
        name: `fkey_author_${tableName}_${userTable}_id`,
        references: {
          table: userTable,
          field: 'id'
        }
      });
    }).then(() => {
      return queryInterface.addConstraint(tableName, ['receiver_id'], {
        type: 'foreign key',
        name: `fkey_receiver_${tableName}_${userTable}_id`,
        references: {
          table: userTable,
          field: 'id'
        }
      });
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
