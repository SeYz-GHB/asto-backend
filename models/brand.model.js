import { DataTypes } from "sequelize";


export default (sequelize) =>(
    sequelize.define("BrandModel", {
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name:{
            type : DataTypes.STRING(100),
            allowNull: false,
            unique : true
        },
        image_url :{
            type : DataTypes.TEXT,
        }
    },
    {
        tableName : "brands",
        timestamps : false,
    })
)