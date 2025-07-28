// models/userToken.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'UserToken',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('reset', 'verify'),
      },
      expires_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'user_tokens',
      timestamps: false,
    }
  );
