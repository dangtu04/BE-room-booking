const { where } = require("sequelize");
const db = require("../models");
const e = require("express");
const { at } = require("lodash");

const savePropertyAmenityService = async (dataInput) => {
  try {
    const { propertyId, propertyAmenityCode } = dataInput;

    if (
      !propertyId ||
      !propertyAmenityCode ||
      !Array.isArray(propertyAmenityCode)
    ) {
      return {
        errCode: 1,
        message: "Missing or invalid required parameters",
      };
    }

    const amenitiesData = propertyAmenityCode.map((code) => ({
      propertyId,
      propertyAmenityCode: code,
    }));
    await db.PropertyAmenity.destroy({
      where: { propertyId },
      individualHooks: true,
    });

    if (amenitiesData.length > 0) {
      await db.PropertyAmenity.bulkCreate(amenitiesData);
    }

    return {
      errCode: 0,
      message: "Property amenities created successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getPropertyAmenitiesByPropertyIdService = async (propertyId) => {
  try {
    if (!propertyId) {
      return {
        errCode: 1,
        message: "Missing required parameter: propertyId",
      };
    }
    const amenities = await db.PropertyAmenity.findAll({
      where: { propertyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return {
      errCode: 0,
      data: amenities,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

module.exports = {
  savePropertyAmenityService,getPropertyAmenitiesByPropertyIdService
};
