const db = require("../models");

const getAllCode = async (inputType) => {
  try {
    if (inputType) {
      const data = await db.Allcode.findAll({
        where: { type: inputType },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return {
        errCode: 0,
        data,
      };
    } else {
      return {
        errCode: 1,
        message: "Missing required parameters",
      };
    }
  } catch (error) {
    console.error("Error fetching all codes:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getListProvinceService = async () => {
  try {
    const data = await db.Allcode.findAll({
      where: { type: "PROVINCE" },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Image,
          as: "image",
          attributes: ["url", "publicId"], // hoặc thêm các field khác nếu cần
        },
      ],
      raw: true,
      nest: true
    });
    return {
      errCode: 0,
      data,
    };
  } catch (error) {
    console.error("Error fetching all codes:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getOutstandingLocationService = async () => {
  try {
    const data = await db.Allcode.findAll({
      where: { type: "PROVINCE" },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Image,
          as: "image",
          attributes: ["url", "publicId"],
        },
      ],
      order: db.Sequelize.literal("RAND()"), // Lấy ngẫu nhiên
      limit: 8, // Chỉ lấy 9 dòng
      raw: true,
      nest: true
    });

    return {
      errCode: 0,
      data,
    };
  } catch (error) {
    console.error("Error fetching outstanding locations:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};
module.exports = { getAllCode, getListProvinceService, getOutstandingLocationService };
