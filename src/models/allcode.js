"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcode.hasMany(models.Property, {
        foreignKey: "provinceCode",
        sourceKey: "keyMap",
        as: "provinceData",
      });
      Allcode.hasMany(models.Property, {
        foreignKey: "typeCode",
        sourceKey: "keyMap",
        as: "typeData",
      });
      Allcode.hasMany(models.Property, {
        foreignKey: "checkInTimeCode",
        sourceKey: "keyMap",
        as: "checkInTimeData",
      });
      Allcode.hasMany(models.Property, {
        foreignKey: "checkOutTimeCode",
        sourceKey: "keyMap",
        as: "checkOutTimeData",
      });

      Allcode.hasMany(models.RoomType, {
        foreignKey: "typeCode",
        sourceKey: "keyMap",
        as: "roomTypeData",
      });
      Allcode.hasMany(models.RoomUnit, {
        foreignKey: "statusCode",
        sourceKey: "keyMap",
        as: "roomStatusData",
      });
      Allcode.hasOne(models.Image, {
        foreignKey: "targetId",
        as: "image",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Allcode;
};
