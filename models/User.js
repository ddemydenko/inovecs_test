module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
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
    },
    {
      tableName: 'users',
    });
  User.associate = ({ Deal }) => {
    User.hasMany(Deal, {
      foreignKey: 'userId',
      as: 'deals',
    });
  };

  return User;
};
