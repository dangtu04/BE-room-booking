const db = require("../models");

const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return {
        isValid: false,
        message: `Missing required field: ${field}`,
      };
    }
  }
  return { isValid: true };
};

const createRoomUnitService = async (data) => {
  try {
    const requiredFields = ["roomTypeId", "roomNumber", "statusCode"];
    const { isValid, message } = validateRequiredFields(data, requiredFields);
    if (!isValid) {
      return {
        errCode: 1,
        message,
      };
    }

    // Tạo room unit mới
    await db.RoomUnit.create({
      roomTypeId: data.roomTypeId,
      roomNumber: data.roomNumber,
      statusCode: data.statusCode,
    });

    return {
      errCode: 0,
      message: "RoomUnit created successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getListRoomUnitByRoomTypeIdService = async (roomTypeId, page, limit) => {
  try {
    if (!roomTypeId) {
      return {
        errCode: 1,
        message: "Missing parameter",
      };
    }
    const offset = (page - 1) * limit;

    const { count, rows } = await db.RoomUnit.findAndCountAll({
      where: { roomTypeId: roomTypeId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "roomStatusData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      offset,
      limit,
      order: [["id", "ASC"]],
      raw: true,
      nest: true,
    });
    return {
      errCode: 0,
      message: "Get list roomUnit successfully",
      data: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

// const updateRoomUnitService = async (data) => {
//   try {
//     if (!data.id) {
//       return {
//         errCode: 1,
//         message: "Missing room type id",
//       };
//     }

//     const roomType = await db.RoomUnit.findOne({
//       where: {
//         id: data.id,
//       },
//       raw: false,
//     });
//     if (roomType) {
//       roomType.typeCode = data.typeCode;
//       roomType.price = data.price;
//       roomType.totalQuantity = data.totalQuantity;
//       roomType.availableQuantity = data.availableQuantity;
//       roomType.numPeople = data.numPeople;
//       await roomType.save();
//       return {
//         errCode: 0,
//         message: "Room type updated successfully",
//       };
//     } else {
//       return {
//         errCode: 2,
//         message: "Room type not found",
//       };
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       errCode: -1,
//       message: "Internal server error",
//     };
//   }
// };

// const deleteRoomUnitService = async (id) => {
//   try {
//     if (!id) {
//       return {
//         errCode: 1,
//         message: "Missing room type id",
//       };
//     }

//     const roomType = await db.RoomUnit.findOne({
//       where: { id: id },
//       raw: false,
//     });
//     if (!roomType) {
//       return {
//         errCode: 2,
//         message: "Room type not found",
//       };
//     }

//     await roomType.destroy();

//     return {
//       errCode: 0,
//       message: "Room type deleted successfully",
//     };
//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       errCode: -1,
//       message: "Internal server error",
//     };
//   }
// };

module.exports = {
  createRoomUnitService,
  getListRoomUnitByRoomTypeIdService,
};
