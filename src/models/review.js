"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Booking, { foreignKey: "bookingId", as: "booking" });
      Review.belongsTo(models.Property, { foreignKey: "propertyId" });
    }
  }
  Review.init(
    {
      userEmail: DataTypes.STRING,
      userName: DataTypes.STRING,
      propertyId: DataTypes.INTEGER,
      bookingId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      reviewToken: DataTypes.STRING,
      reviewDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
