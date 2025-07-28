import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'MouseModel',
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

      dpi: {
        type: DataTypes.INTEGER,
      },

      mouse_rgb: {
        type: DataTypes.BOOLEAN,
      },

      connection: {
        type: DataTypes.STRING(100),
      },

      battery: {
        type: DataTypes.STRING(50),
      },

      weight_grams: {
        type: DataTypes.INTEGER,
      },
      mouse_color:{
        type : DataTypes.STRING,
      },
      mouse_other_features: {
        type: DataTypes.TEXT,
      },
      category: { type: DataTypes.STRING } 

    },
    {
      tableName: 'mouse_model',
      timestamps: false,
      underscored: true,
    }
  );
