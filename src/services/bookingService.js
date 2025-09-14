const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sendConfirmEmail } = require("./emailService");
const { at } = require("lodash");
const { Op, fn, col, literal, Sequelize, } = require("sequelize");

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

const buildUrlEmail = (token) => {
  let result = `${process.env.URL_REACT}/verify-email?token=${token}`;
  return result;
};

const createBookingService = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const requiredFields = [
      // "userId",
      "userName",
      "userPhone",
      "userEmail",
      "totalPrice",
      "checkInDate",
      "checkOutDate",
      "numPeople",
      "numRooms",
      "bookingItems",
      "propertyId",
    ];

    const { isValid, message } = validateRequiredFields(data, requiredFields);
    if (!isValid) {
      return {
        errCode: 1,
        message,
      };
    }

    const token = uuidv4();

    await sendConfirmEmail({
      reciverEmail: data.userEmail,
      userName: data.userName,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      totalPrice: data.totalPrice,
      language: data.language,
      propertyName: data.propertyName,
      propertyAddress: data.propertyAddress,
      checkInTimeData: data.checkInTimeData,
      checkOutTimeData: data.checkOutTimeData,
      typeData: data.typeData,
      numPeople: data.numPeople,
      numRooms: data.numRooms,

      redirectLink: buildUrlEmail(token),
    });

    const newBooking = await db.Booking.create(
      {
        // userId: data.userId,
        userName: data.userName,
        userPhone: data.userPhone,
        userEmail: data.userEmail,
        totalPrice: data.totalPrice,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numPeople: data.numPeople,
        numRooms: data.numRooms,
        propertyId: data.propertyId,
        statusCode: "PENDING",
        token: token,
      },
      { transaction: t }
    );
    if (newBooking && newBooking.id) {
      const bookingItems = data.bookingItems.map((item) => ({
        bookingId: newBooking.id,
        roomTypeId: item.roomTypeId,
        quantity: item.quantity,
      }));
      await db.BookingItem.bulkCreate(bookingItems, { transaction: t });
      await t.commit();
    }
    return {
      errCode: 0,
      message: "Create Booking successfully",
    };
  } catch (error) {
    console.log("Error: ", error);
    await t.rollback();
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const verifyBookingService = async (data) => {
  try {
    if (!data.token) {
      return {
        errCode: 1,
        message: "Missing required field: token",
      };
    } else {
      const booking = await db.Booking.findOne({
        where: {
          token: data.token,
          statusCode: "PENDING",
        },
        raw: false,
      });

      if (booking) {
        booking.statusCode = "CONFIRMED";
        await booking.save();
        return {
          errCode: 0,
          message: "Booking confirmed successfully",
        };
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getBookingListService = async (data) => {
  try {
    if (!data.propertyId) {
      return {
        errCode: 1,
        message: "Missing required field: propertyId",
      };
    }

    const whereCondition = {
      propertyId: data.propertyId,
    };

    if (data.statusCode) {
      whereCondition.statusCode = data.statusCode;
    }
    // lọc khoảng ngày (theo updatedAt)
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      // chỉnh endDate sang cuối ngày
      end.setHours(23, 59, 59, 999);

      whereCondition.updatedAt = {
        [Op.between]: [start, end],
      };

      // whereCondition.updatedAt = {
      //   [Op.between]: [new Date(data.startDate), new Date(data.endDate)],
      // };
    }
    const bookings = await db.Booking.findAll({
      where: whereCondition,
      attributes: {
        exclude: ["userId", "createdAt", "updatedAt"],
      },
      order: [["updatedAt", "DESC"]],
    });
    return {
      errCode: 0,
      data: bookings,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const changeBookingStatusService = async (data) => {
  try {
    if (!data.bookingId || !data.statusCode) {
      return {
        errCode: 1,
        message: "Missing required field: bookingId or statusCode",
      };
    }
    const booking = await db.Booking.findOne({
      where: { id: data.bookingId },
      raw: false,
    });
    if (booking) {
      booking.statusCode = data.statusCode;
      await booking.save();
    } else {
      return {
        errCode: 2,
        message: "Booking not found",
      };
    }
    return {
      errCode: 0,
      message: "Change booking status successfully",
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getOwnerRevenueService = async (query) => {
  try {
    const { propertyId, type, startDate, endDate } = query;

    if (!propertyId) {
      return { errCode: 1, message: "Missing propertyId" };
    }

    // điều kiện where
    let whereClause = {
      propertyId: propertyId,
      statusCode: "CHECKED_OUT", // chỉ lấy booking đã duyệt
    };

    if (startDate && endDate) {
      whereClause.checkInDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    // groupBy theo type
    let attributes = [];
    switch (type) {
      case "day":
        attributes = [
          [fn("DATE", col("checkInDate")), "period"],
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        break;
      case "week":
        attributes = [
          [literal("YEARWEEK(checkInDate, 1)"), "period"],
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        break;
      case "month":
        attributes = [
          [fn("DATE_FORMAT", col("checkInDate"), "%Y-%m"), "period"],
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        break;
      case "year":
        attributes = [
          [fn("YEAR", col("checkInDate")), "period"],
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        break;
      default:
        // mặc định group theo ngày
        attributes = [
          [fn("DATE", col("checkInDate")), "period"],
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        break;
    }

    const revenueData = await db.Booking.findAll({
      attributes,
      where: whereClause,
      group: ["period"],
      order: [[literal("period"), "ASC"]],
      raw: true,
    });

    return {
      errCode: 0,
      data: revenueData,
    };
  } catch (e) {
    console.error("Error getRevenue:", e);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getAdminRevenueService = async ({
  propertyId,
  type,
  startDate,
  endDate,
}) => {
  try {
    let where = {
      statusCode: "CHECKED_OUT",
    };

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (startDate && endDate) {
      where.checkOutDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Tạo group theo loại period
    let groupBy = [];
    let attributes = [];

    switch (type) {
      case "day":
        attributes = [
          [fn("DATE", col("checkOutDate")), "period"],
          "propertyId",
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        groupBy = [literal("DATE(checkOutDate)"), "propertyId"];
        break;

      case "month":
        attributes = [
          [fn("DATE_FORMAT", col("checkOutDate"), "%Y-%m"), "period"],
          "propertyId",
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        groupBy = [literal("DATE_FORMAT(checkOutDate, '%Y-%m')"), "propertyId"];
        break;

      case "year":
        attributes = [
          [fn("YEAR", col("checkOutDate")), "period"],
          "propertyId",
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        groupBy = [literal("YEAR(checkOutDate)"), "propertyId"];
        break;

      default:
        attributes = [
          [fn("YEARWEEK", col("checkOutDate"), 1), "period"],
          "propertyId",
          [fn("SUM", col("totalPrice")), "revenue"],
        ];
        groupBy = [literal("YEARWEEK(checkOutDate, 1)"), "propertyId"];
        break;
    }

    const data = await db.Booking.findAll({
      attributes,
      where,
      group: groupBy,
      raw: true,
    });

    return {
      errCode: 0,
      data,
    };
  } catch (error) {
    console.error("getAdminRevenueService error:", error);
    return {
      errCode: 1,
      message: "Internal server error",
    };
  }
};





module.exports = {
  createBookingService,
  verifyBookingService,
  getBookingListService,
  changeBookingStatusService,
  getOwnerRevenueService,
  getAdminRevenueService,
};
