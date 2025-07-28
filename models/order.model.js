import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      shipping_address: {
        type: DataTypes.TEXT,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      status: {
        type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      customer_name: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },

      paid_at: {
        type: DataTypes.DATE,
        allowNull: true, // It can be null until payment is done
      },

    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );
