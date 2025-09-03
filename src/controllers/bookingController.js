const { createBookingService } = require("../services/bookingService");

const createBooking = async (req, res) => {
  const data = await createBookingService(req.body);
  return res.status(200).json(data);
};
module.exports = {
  createBooking,
};
