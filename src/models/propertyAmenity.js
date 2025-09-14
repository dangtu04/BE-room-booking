"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PropertyAmenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  PropertyAmenity.init(
    {
      propertyId: DataTypes.INTEGER,
      propertyAmenityCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PropertyAmenity",
    }
  );
  return PropertyAmenity;
};
