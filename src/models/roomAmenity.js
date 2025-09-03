"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomAmenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  RoomAmenity.init(
    {
      // roomId là roomTypeId không phải roomUnitId
      roomId: DataTypes.INTEGER,
      amenityCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomAmenity",
    }
  );
  return RoomAmenity;
};
