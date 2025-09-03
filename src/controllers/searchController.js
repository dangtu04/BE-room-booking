const {
  searchService,
  saerchPropertiesByProvinceService,
  getSuitableRoomTypesService,
} = require("../services/searchService");

const searchController = async (req, res) => {
  const data = await searchService(req.body);
  return res.status(200).json(data);
};

const saerchPropertiesByProvince = async (req, res) => {
  const data = await saerchPropertiesByProvinceService(req.query.provinceCode);
  return res.status(200).json(data);
};

const getSuitableRoomTypes = async (req, res) => {
  const { propertyId, totalGuests, roomsRequested, checkInDate , checkOutDate } = req.query;
  const data = await getSuitableRoomTypesService({ propertyId, totalGuests, roomsRequested, checkInDate , checkOutDate });
  return res.status(200).json(data);
};
module.exports = {
  searchController,
  saerchPropertiesByProvince,
  getSuitableRoomTypes
};
