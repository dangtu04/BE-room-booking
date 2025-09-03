"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      userName: DataTypes.STRING,
      userPhone: DataTypes.STRING,
      userEmail: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
      checkInDate: DataTypes.STRING,
      checkOutDate: DataTypes.STRING,
      numPeople: DataTypes.INTEGER,
      numRooms: DataTypes.INTEGER,
      statusCode: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
