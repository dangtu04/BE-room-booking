'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init({
    bookingId: DataTypes.INTEGER,/** */
    paymentMethod: DataTypes.STRING,/** Phương thức thanh toán */
    amount: DataTypes.FLOAT,/** thành tiền  */
    status: DataTypes.STRING,/** trạng thái */
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};