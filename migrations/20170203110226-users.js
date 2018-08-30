const tableName = 'users';

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
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        field: 'middle_name',
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      loginAt: {
        type: DataTypes.DATE,
        field: 'login_at',
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
    }, opts);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
