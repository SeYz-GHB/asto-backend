// models/product.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      brand : {
        type : DataTypes.STRING(255),
        allowNull : true,
      },
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'brands', key: 'id' },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      description: {
        type: DataTypes.TEXT,
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      image_url: {
        type: DataTypes.TEXT,
      },
      category: {
        type: DataTypes.STRING(255), // this is the new field
        allowNull: false,
      },
      create_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'products',
      timestamps: false,
    }
  );
