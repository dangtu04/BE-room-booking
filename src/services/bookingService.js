const db = require("../models");
const { v4: uuidv4 } = require("uuid");
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

const createBookingService = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const requiredFields = [
      "userId",
      "userName",
      "userPhone",
      "userEmail",
      "totalPrice",
      "checkInDate",
      "checkOutDate",
      "numPeople",
      "numRooms",
      "bookingItems",
    ];

    const { isValid, message } = validateRequiredFields(data, requiredFields);
    if (!isValid) {
      return {
        errCode: 1,
        message,
      };
    }

    const token = uuidv4();

    const newBooking = await db.Booking.create(
      {
        userId: data.userId,
        userName: data.userName,
        userPhone: data.userPhone,
        userEmail: data.userEmail,
        totalPrice: data.totalPrice,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numPeople: data.numPeople,
        numRooms: data.numRooms,
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

module.exports = { createBookingService };
