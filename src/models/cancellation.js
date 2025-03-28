'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancellation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cancellation.init({
    bookingId: DataTypes.INTEGER,/** */
    refundAmount: DataTypes.FLOAT,/** Số tiền hoàn */
    cancelledAt: DataTypes.DATE,/** thời gian huỷ  */
  }, {
    sequelize,
    modelName: 'Cancellation',
  });
  return Cancellation;
};