'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init({
    busId: DataTypes.INTEGER, /** mã số xe */
    routeId: DataTypes.INTEGER, /** mã tuyến */
    departureTime: DataTypes.STRING, /** Giờ khởi hành */
    arrivalTime: DataTypes.STRING, /** Giờ đến dự kiến */
    status: DataTypes.STRING, /** trạng thái */
 
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};