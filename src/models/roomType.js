"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomType.belongsTo(models.Allcode, {
        foreignKey: "typeCode",
        targetKey: "keyMap",
        as: "roomTypeData",
      });
    }
  }
  RoomType.init(
    {
      propertyId: DataTypes.INTEGER,
      typeCode: DataTypes.STRING,
      price: DataTypes.INTEGER,
      totalQuantity: DataTypes.INTEGER,
      availableQuantity: DataTypes.INTEGER,
      numPeople: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RoomType",
    }
  );
  return RoomType;
};
