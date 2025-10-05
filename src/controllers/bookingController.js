const {
  createBookingService,
  verifyBookingService,
  getBookingListService,
  changeBookingStatusService,
  getOwnerRevenueService,
  getAdminRevenueService,
} = require("../services/bookingService");

const createBooking = async (req, res) => {
  const data = await createBookingService(req.body);
  return res.status(200).json(data);
};

const verifyBooking = async (req, res) => {
  const data = await verifyBookingService(req.body);
  return res.status(200).json(data);
};

const getBookingList = async (req, res) => {
   const data = await getBookingListService(req.query,);
  return res.status(200).json(data);
};

const changeBookingStatus = async (req, res) => {
  const data = await changeBookingStatusService(req.body);
  return res.status(200).json(data);
};

const getOwnerRevenue = async (req, res) => {
  const data = await getOwnerRevenueService(req.query);
  return res.status(200).json(data);
};

const getAdminRevenue = async (req, res) => {
  const data = await getAdminRevenueService(req.query);
  return res.status(200).json(data);
};

module.exports = {
  createBooking,
  verifyBooking,
  getBookingList,
  changeBookingStatus,
  getOwnerRevenue,
  getAdminRevenue,
};
