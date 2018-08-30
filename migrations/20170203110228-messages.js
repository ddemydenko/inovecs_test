const tableName = 'messages';
const dealsTable = 'deals';
const usersTable = 'users';

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
    }, opts).then(() => {
      return queryInterface.addConstraint(tableName, ['deal_id'], {
        type: 'foreign key',
        name: `fkey_${tableName}_${dealsTable}_id`,
        references: {
          table: dealsTable,
          field: 'id'
        }
      });
    }).then(() => {
      return queryInterface.addConstraint(tableName, ['author_id'], {
        type: 'foreign key',
        name: `fkey_author_${tableName}_${usersTable}_id`,
        references: {
          table: usersTable,
          field: 'id'
        }
      });
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
