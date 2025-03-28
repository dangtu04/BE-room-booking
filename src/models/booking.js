'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,         // mã người đặt vé
    tripId: DataTypes.INTEGER,         // mã chuyến xe
    stationId: DataTypes.INTEGER,      // trạm đón khách
    seatNumbers: DataTypes.STRING,    // mã số ghế đã đặt
    totalPrice: DataTypes.FLOAT,      // giá tiền
    status: DataTypes.STRING,          // trạng thái
  }, {
    sequelize,
    modelName: 'Booking',
  });
  
  return Booking;
};