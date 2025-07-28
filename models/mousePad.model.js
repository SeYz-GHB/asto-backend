// models/mousePad.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'MousepadModel',
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
      size: {
        type: DataTypes.STRING(50), // e.g. 'XL'
      },
      material: {
        type: DataTypes.STRING(50), // e.g. 'Cloth'
      },
      thickness_mm: {
        type: DataTypes.DECIMAL(4, 1), // e.g. 3.5
      },
      mousepad_color: {
        type: DataTypes.STRING(30),
      },
    },
    {
      tableName: 'mousepad_model',
      timestamps: false,
    }
  );
