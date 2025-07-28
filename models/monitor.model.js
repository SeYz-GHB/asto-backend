// models/monitor.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'MonitorModel',
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
      screen_size: {
        type: DataTypes.STRING(20), // e.g., '27 inch'
      },
      resolution: {
        type: DataTypes.STRING(50), // e.g., '2560x1440'
      },
      refresh_rate: {
        type: DataTypes.STRING(15), // e.g., 144
      },
      panel_type: {
        type: DataTypes.STRING(50), // e.g., 'IPS'
      },
      monitor_connection: {
        type: DataTypes.STRING(50), // e.g., 'HDMI, DisplayPort'
      },
      monitor_color: {
        type : DataTypes.STRING(20)
      },
      monitor_weight : {
        type : DataTypes.STRING(15)
      }
      
    },
    {
      tableName: 'monitor_model',
      timestamps: false,
      underscored : true,
    }
  );
