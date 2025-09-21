"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class About extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  About.init(
    {
      contentMarkdown: DataTypes.TEXT("long"),
      contentHTML: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "About",
    }
  );
  return About;
};
