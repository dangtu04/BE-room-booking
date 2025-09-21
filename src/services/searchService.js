const { Op } = require("sequelize");
const db = require("../models");
const { at } = require("lodash");
const searchService = async (input) => {
  try {
    const matchedProperties = await db.Property.findAll({
      where: {
        provinceCode: input.location,
      },
    });

    for (const property of matchedProperties) {
      const roomTypes = await db.RoomType.findAll({
        where: {
          propertyId: property.id,
          numPeople: { [Op.gte]: input.numPeople },
        },
      });

      for (const rt of roomTypes) {
        const roomUnits = await db.RoomUnit.findAll({
          where: { roomTypeId: rt.id },
        });

        const roomUnitIds = roomUnits.map((r) => r.id);

        // Tìm các Booking bị trùng lịch
        const bookings = await Booking.findAll({
          where: {
            roomId: roomUnitIds,
            [Op.or]: [
              {
                checkInDate: {
                  [Op.between]: [input.checkInDate, input.checkOutDate],
                },
              },
              {
                checkOutDate: {
                  [Op.between]: [input.checkInDate, input.checkOutDate],
                },
              },
              {
                checkInDate: { [Op.lte]: input.checkInDate },
                checkOutDate: { [Op.gte]: input.checkOutDate },
              },
            ],
          },
        });

        const bookedRoomIds = new Set(bookings.map((b) => b.roomId));
        const availableRooms = roomUnits.filter(
          (r) => !bookedRoomIds.has(r.id)
        );

        if (availableRooms.length >= input.numRooms) {
          // Thêm property này vào kết quả
          console.log("true");
        }
      }
    }

    console.log("check booking3: ");

    return {
      errCode: 0,
      data: matchedProperties,
    };
  } catch (error) {
    console.error("Error search:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const saerchPropertiesByProvinceService = async (inputData) => {
  try {
    const { provinceCode, typeCode } = inputData;
    if (!provinceCode) {
      return {
        errCode: 1,
        message: "Missing provinceCode",
      };
    }

    let whereCondition = { provinceCode };

    if (typeCode) {
      const typeArray = Array.isArray(typeCode) ? typeCode : [typeCode];
      whereCondition.typeCode = {
        [Op.in]: typeArray,
      };
    }

    // console.log("check whereCondition: ", whereCondition);

    const data = await db.Property.findAll({
      where: whereCondition,
      attributes: ["id", "name", "address", "avatar", "typeCode"],
      raw: true,
    });

    if (data.length > 0) {
      return {
        errCode: 0,
        message: "Get properties successfully",
        data,
      };
    } else {
      return {
        errCode: 2,
        message: "Property not found!",
      };
    }
  } catch (error) {
    console.log("Get property error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getSuitableRoomTypesService = async ({
  propertyId,
  totalGuests,
  roomsRequested,
  checkInDate,
  checkOutDate,
}) => {
  try {
    if (
      !propertyId ||
      !totalGuests ||
      !roomsRequested ||
      !checkInDate ||
      !checkOutDate
    ) {
      return {
        errCode: 1,
        message: "Missing required parameters",
      };
    }

    const perRoomMinCapacity = Math.ceil(totalGuests / roomsRequested);

    // Lấy các RoomType phù hợp
    const roomTypes = await db.RoomType.findAll({
      where: {
        propertyId: propertyId,
        numPeople: {
          [Op.gte]: perRoomMinCapacity,
        },
        availableQuantity: {
          [Op.gte]: roomsRequested,
        },
      },
      include: [
        {
          model: db.Allcode,
          as: "roomTypeData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      attributes: {
        exclude: ["propertyId", "createdAt", "updatedAt"],
      },
      raw: true,
      nest: true,
    });

    const filteredRoomTypes = [];
    for (let roomType of roomTypes) {
      // Lấy danh sách RoomUnit thuộc RoomType, loại bỏ các phòng đang bảo trì hoặc đã đóng
      const roomUnits = await db.RoomUnit.findAll({
        where: {
          roomTypeId: roomType.id,
          statusCode: {
            [Op.notIn]: ["MAINTENANCE", "CLOSED"],
          },
        },
        attributes: ["id"],
        raw: true,
      });

      const roomUnitIds = roomUnits.map((unit) => unit.id);

      // Lấy các bookingId có phòng này và trùng thời gian
      const bookings = await db.Booking.findAll({
        where: {
          [Op.or]: [
            {
              checkInDate: {
                [Op.between]: [checkInDate, checkOutDate],
              },
            },
            {
              checkOutDate: {
                [Op.between]: [checkInDate, checkOutDate],
              },
            },
            {
              checkInDate: { [Op.lte]: checkInDate },
              checkOutDate: { [Op.gte]: checkOutDate },
            },
          ],
          statusCode: { [Op.not]: "CANCELLED" },
        },
        attributes: ["id"],
        raw: true,
      });
      const bookingIds = bookings.map((b) => b.id);

      // lấy các bookingitem thuộc các bookingId này và roomType hiện tại
      const bookedItems = await db.BookingItem.findAll({
        where: {
          bookingId: {
            [Op.in]: bookingIds,
          },
          roomTypeId: roomType.id,
        },
        attributes: ["quantity"],
        raw: true,
      });

      // tổng số phòng đã được đặt cho roomType này trong khoảng thời gian
      const bookedQuantity = bookedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Số lượng phòng còn lại thực tế
      const availableQuantity = roomUnits.length - bookedQuantity;

      if (availableQuantity >= roomsRequested) {
        filteredRoomTypes.push({
          ...roomType,
          availableQuantity: availableQuantity,
        });
      }
    }

    if (filteredRoomTypes.length === 0) {
      return {
        errCode: 2,
        message: "No suitable room types available for the requested dates",
        data: [],
      };
    }

    return {
      errCode: 0,
      message: "Get RoomTypes successfully",
      data: filteredRoomTypes,
    };
  } catch (error) {
    console.log("Get RoomTypes error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

module.exports = {
  searchService,
  saerchPropertiesByProvinceService,
  getSuitableRoomTypesService,
};
