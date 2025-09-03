const { createRoomAmenityService } = require("../services/roomAmenityService");

const createRoomAmenity = async (req, res) => {
  const data = await createRoomAmenityService(req.body);
  return res.status(200).json(data);
};
module.exports = {
  createRoomAmenity,
};
