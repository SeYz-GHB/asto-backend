import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('customer', 'admin','seller'),
        defaultValue: 'customer',
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      last_login: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reset_password_token: {
        type: DataTypes.STRING,
      },
      reset_password_expires_at: {
        type: DataTypes.DATE,
      },
      verification_token: {
        type: DataTypes.STRING,
      },
      verification_token_expires_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );
