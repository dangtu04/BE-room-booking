const { getAllCode, getListProvinceService, getOutstandingLocationService } = require("../services/allcodeService");

const handleGetAllCode = async (req, res) => {
  const data = await getAllCode(req.query.type);
  return res.status(200).json(data);
};

const getListProvince = async (req, res) => {
  const data = await getListProvinceService();
  return res.status(200).json(data);
};

const getOutstandingLocation = async (req, res) => {
  const data = await getOutstandingLocationService();
  return res.status(200).json(data);
};

module.exports = {
  handleGetAllCode,
  getListProvince,
  getOutstandingLocation
};
