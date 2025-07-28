import { Sequelize } from 'sequelize';
import UserModel from './user.model.js';
import ProductModel from './product.model.js';
import MouseModel from './mouse.model.js';
import KeyboardModel from './keyboard.model.js';  
import MousepadModel from './mousePad.model.js';     
import HeadphoneModel from './headphone.model.js';   
import MonitorModel from './monitor.model.js';       
import ReviewModel from './review.model.js';
import OrderModel from './order.model.js';
import OrderItemModel from './orderItem.model.js';
import PaymentModel from './payment.model.js';
import UserTokenModel from './userToken.model.js';
import { sequelize } from '../config/sequelize.js';
import BrandModel from './brand.model.js';
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.User = UserModel(sequelize);
db.Product = ProductModel(sequelize);
db.MouseModel = MouseModel(sequelize); 
db.KeyboardModel = KeyboardModel(sequelize); 
db.HeadphoneModel = HeadphoneModel(sequelize); 
db.MousepadModel = MousepadModel(sequelize); 
db.MonitorModel = MonitorModel(sequelize); 
db.Review = ReviewModel(sequelize);
db.Order = OrderModel(sequelize);
db.OrderItem = OrderItemModel(sequelize);
db.Payment = PaymentModel(sequelize);
db.UserToken = UserTokenModel(sequelize);
db.Brand = BrandModel(sequelize)
//Association
// ✅ Associations

// 1️⃣ Product detail tables
db.Product.hasOne(db.MouseModel,    { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.Product.hasOne(db.KeyboardModel, { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.Product.hasOne(db.HeadphoneModel,{ foreignKey: 'product_id', onDelete: 'CASCADE' });
db.Product.hasOne(db.MousepadModel, { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.Product.hasOne(db.MonitorModel,  { foreignKey: 'product_id', onDelete: 'CASCADE' });

db.MouseModel.belongsTo   (db.Product, { foreignKey: 'product_id' });
db.KeyboardModel.belongsTo(db.Product, { foreignKey: 'product_id' });
db.HeadphoneModel.belongsTo(db.Product,{ foreignKey: 'product_id' });
db.MousepadModel.belongsTo(db.Product, { foreignKey: 'product_id' });
db.MonitorModel.belongsTo (db.Product, { foreignKey: 'product_id' });

// 2️⃣ Reviews
db.Product.hasMany(db.Review, { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Product, { foreignKey: 'product_id' });

// 3️⃣ Orders, Items, Payments
db.User.hasMany   (db.Order, { foreignKey: 'user_id', onDelete: 'SET NULL' });
db.Order.belongsTo(db.User,  { foreignKey: 'user_id' });

// ✅ Fix alias here
db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id', as: 'order' });

// ✅ Fix alias for Product
db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id', as: 'orderItems', onDelete: 'SET NULL' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// Payment association
db.Order.hasOne   (db.Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });

// 4️⃣ User Tokens
db.User.hasMany(db.UserToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.UserToken.belongsTo(db.User, { foreignKey: 'user_id' });

// 5️⃣ Brand association
db.Brand.hasMany(db.Product, { foreignKey: 'brand_id', onDelete: 'CASCADE' });
db.Product.belongsTo(db.Brand, { foreignKey: 'brand_id', onDelete: 'CASCADE' });


console.log('DB_USER:', process.env.DB_USER); // 👈 check if it's empty

/* ---------- Export ---------- */
export default db;