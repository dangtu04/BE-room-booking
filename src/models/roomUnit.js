"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       RoomUnit.belongsTo(models.Allcode, {
        foreignKey: "statusCode",
        targetKey: "keyMap",
        as: "roomStatusData",
      });
    }
  }
  RoomUnit.init(
    {
      roomTypeId: DataTypes.INTEGER,
      roomNumber: DataTypes.STRING,
      statusCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomUnit",
    }
  );
  return RoomUnit;
};
