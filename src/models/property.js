"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Property.belongsTo(models.Allcode, {
        foreignKey: "provinceCode",
        targetKey: "keyMap",
        as: "provinceData",
      });
      Property.belongsTo(models.Allcode, {
        foreignKey: "typeCode",
        targetKey: "keyMap",
        as: "typeData",
      });

      Property.belongsTo(models.Allcode, {
        foreignKey: "checkInTimeCode",
        targetKey: "keyMap",
        as: "checkInTimeData",
      });
      Property.belongsTo(models.Allcode, {
        foreignKey: "checkOutTimeCode",
        targetKey: "keyMap",
        as: "checkOutTimeData",
      });
      Property.hasMany(models.Review, { foreignKey: "propertyId" });
    }
  }

  Property.init(
    {
      name: DataTypes.STRING,
      provinceCode: DataTypes.STRING,
      address: DataTypes.STRING,
      typeCode: DataTypes.STRING,
      avatar: DataTypes.STRING,
      public_id: DataTypes.STRING,
      ownerId: DataTypes.INTEGER,
      contentMarkdown: DataTypes.TEXT("long"),
      contentHTML: DataTypes.TEXT("long"),
      checkInTimeCode: DataTypes.STRING,
      checkOutTimeCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
