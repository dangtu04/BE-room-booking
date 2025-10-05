const {
  createRoomUnitService,
  getListRoomUnitByRoomTypeIdService,
} = require("../services/roomUnitService");

const createRoomUnit = async (req, res) => {
  const data = await createRoomUnitService(req.body);
  return res.status(200).json(data);
};

const getListRoomUnitByRoomTypeId = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const data = await getListRoomUnitByRoomTypeIdService(
    req.query.roomTypeId,
    page,
    limit
  );
  return res.status(200).json(data);
};

// const updateRoomUnit = async (req, res) => {
//   const data = await updateRoomUnitService(req.body);
//   return res.status(200).json(data);
// };

// const deleteRoomUnit = async (req, res) => {
//   const data = await deleteRoomUnitService(req.body.id);
//   return res.status(200).json(data);
// };
module.exports = {
  createRoomUnit,
  getListRoomUnitByRoomTypeId,
};
