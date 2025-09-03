const db = require("../models");

const createRoomAmenityService = async (dataInput) => {
  try {
     const { roomId, amenityCodes } = dataInput;

    // Validate
    if (!roomId || !Array.isArray(amenityCodes) || amenityCodes.length === 0) {
      return {
        errCode: 1,
        message: "Invalid input data. Please provide roomId and an array of amenityCodes.",
      }
    }
    const data = amenityCodes.map(code => ({
      roomId,
      amenityCode: code
    }));

    // Xóa tiện ích cũ của phòng để tránh trùng
    await db.RoomAmenity.destroy({ where: { roomId } });

    // Thêm mới nhiều tiện ích cùng lúc
    await db.RoomAmenity.bulkCreate(data);

    return {
      errCode: 0,
      message: "Amenities added successfully",
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};
module.exports = {
  createRoomAmenityService,
};
