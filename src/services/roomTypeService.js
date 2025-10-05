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

const createRoomTypeService = async (data) => {
  try {
    const requiredFields = [
      "propertyId",
      "typeCode",
      "price",
      "totalQuantity",
      "availableQuantity",
      "numPeople",
    ];
    const { isValid, message } = validateRequiredFields(data, requiredFields);
    if (!isValid) {
      return {
        errCode: 1,
        message,
      };
    }

    // Tạo room type mới
    await db.RoomType.create({
      propertyId: data.propertyId,
      typeCode: data.typeCode,
      price: data.price,
      totalQuantity: data.totalQuantity,
      availableQuantity: data.availableQuantity,
      numPeople: data.numPeople,
    });

    return {
      errCode: 0,
      message: "RoomType created successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getListRoomTypeByPropertyIdService = async (propertyId, page, limit) => {
  try {
    const offset = (page - 1) * limit;
    if (!propertyId) {
      return {
        errCode: 1,
        message: "Missing parameter",
      };
    }

    const { count, rows } = await db.RoomType.findAndCountAll({
      where: { propertyId: propertyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "roomTypeData",
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
      message: "Get list roomType successfully",
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
      data: [],
    };
  }
};
const updateRoomTypeService = async (data) => {
  try {
    if (!data.id) {
      return {
        errCode: 1,
        message: "Missing room type id",
      };
    }

    const roomType = await db.RoomType.findOne({
      where: {
        id: data.id,
      },
      raw: false,
    });
    if (roomType) {
      roomType.typeCode = data.typeCode;
      roomType.price = data.price;
      roomType.totalQuantity = data.totalQuantity;
      roomType.availableQuantity = data.availableQuantity;
      roomType.numPeople = data.numPeople;
      await roomType.save();
      return {
        errCode: 0,
        message: "Room type updated successfully",
      };
    } else {
      return {
        errCode: 2,
        message: "Room type not found",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const deleteRoomTypeService = async (id) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        message: "Missing room type id",
      };
    }

    const roomType = await db.RoomType.findOne({
      where: { id: id },
      raw: false,
    });
    if (!roomType) {
      return {
        errCode: 2,
        message: "Room type not found",
      };
    }

    await roomType.destroy();

    return {
      errCode: 0,
      message: "Room type deleted successfully",
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
  createRoomTypeService,
  getListRoomTypeByPropertyIdService,
  updateRoomTypeService,
  deleteRoomTypeService,
};
