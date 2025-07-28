import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'HeadphoneModel',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frequency_response: {
        type: DataTypes.STRING(50),
      },
      mic: {
        type: DataTypes.BOOLEAN,
      },
      headphone_connection: {
        type: DataTypes.STRING(100),
      },
      surround_sound: {
        type: DataTypes.BOOLEAN,
      },
       headphone_battery: {
        type: DataTypes.STRING(100), // e.g. "20 hours", or "Rechargeable"
        allowNull: true,
      },
      headphone_weight_grams: {
        type: DataTypes.INTEGER, // e.g. 250
        allowNull: true,
      },
      headphone_color: {
        type: DataTypes.STRING(50), // e.g. "Black"
        allowNull: true,
      },
      headphone_other_features: {
        type: DataTypes.TEXT, // e.g. "Noise-cancelling, foldable"
        allowNull: true,
      },
    },
    {
      tableName: 'headphone_model',
      timestamps: false,
    }
  );
