import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Only support KHQR or similar
      method: {
        type: DataTypes.ENUM('qr'),
        allowNull: false,
        defaultValue: 'qr',
      },

      status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
      },

      paid_at: {
        type: DataTypes.DATE,
      },

      transaction_id: {
        type: DataTypes.STRING(255),
      },

      // Optional: store uploaded screenshot (filename or Cloudinary URL)
      proof_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payer_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'payments',
      timestamps: false,
    }
  );
