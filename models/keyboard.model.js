import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'KeyboardModel',
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
      layout: {
        type: DataTypes.STRING(50),
        allowNull : false
      },
      switch_type: {
        type: DataTypes.STRING(50),
        allowNull: null,
      },
      keyboard_color : {
        type : DataTypes.STRING(50)
      },
    
      keyboard_rgb: {
        type: DataTypes.BOOLEAN,
        allowNull : null,
      },
      keyboard_connection: {
        type: DataTypes.STRING(100),
        allowNull : false
      },
      keycap_material: {
        type: DataTypes.STRING(50),
        allowNull : null,
      },
      keyboard_battery: {
        type: DataTypes.STRING(50),
      },
  
      keyboard_weight_grams: {
        type: DataTypes.INTEGER,
      },
  
      keyboard_other_features: {
        type: DataTypes.TEXT,
      }
    },
    
    
    {
      tableName: 'keyboard_model',
      timestamps: false,
      underscored : true,
    }
  );
