'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Route.init({
    routeName: DataTypes.STRING, /** Tên của tuyến xe */
    startLocation: DataTypes.STRING, /** Điểm đi */
    endLocation: DataTypes.STRING, /** Điểm đến */
    distance: DataTypes.FLOAT, /** Khoảng cách */
    estimatedTime: DataTypes.STRING, /** Thời gian ước tính */
    price: DataTypes.FLOAT, /** Giá */
  }, {
    sequelize,
    modelName: 'Route',
  });
  return Route;
};