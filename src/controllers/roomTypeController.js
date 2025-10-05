const {
  createRoomTypeService,
  getListRoomTypeByPropertyIdService,
  updateRoomTypeService,
  deleteRoomTypeService,
} = require("../services/roomTypeService");

const createRoomType = async (req, res) => {
  const data = await createRoomTypeService(req.body);
  return res.status(200).json(data);
};

const getListRoomTypeByPropertyId = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const data = await getListRoomTypeByPropertyIdService(req.query.propertyId, page, limit);
  return res.status(200).json(data);
};

const updateRoomType = async (req, res) => {
  const data = await updateRoomTypeService(req.body);
  return res.status(200).json(data);
};

const deleteRoomType = async (req, res) => {
  const data = await deleteRoomTypeService(req.body.id);
  return res.status(200).json(data);
};
module.exports = {
  createRoomType,
  getListRoomTypeByPropertyId,
  updateRoomType,
  deleteRoomType,
};
