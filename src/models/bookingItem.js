"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookingItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookingItem.belongsTo(models.Booking, { foreignKey: "bookingId", as: "booking" });
      BookingItem.belongsTo(models.RoomType, { foreignKey: "roomTypeId", as: "roomType" });
    }
  }
  BookingItem.init(
    {
      bookingId: DataTypes.INTEGER,
      roomTypeId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BookingItem",
    }
  );
  return BookingItem;
};
