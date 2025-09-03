const {
  createPropertyService,
  getAllPropertiesService,
  getPropertyByIdService,
  editPropertyService,
  getPropertiesByProvinceService,
} = require("../services/propertyService");

const createProperty = async (req, res) => {
  const data = await createPropertyService(req.body, req.file);
  return res.status(200).json(data);
};

const getAllProperties = async (req, res) => {
  const data = await getAllPropertiesService();
  return res.status(200).json(data);
};

const getPropertyById = async (req, res) => {
  const data = await getPropertyByIdService(req.query.id);
  return res.status(200).json(data);
};

const getPropertiesByProvince = async (req, res) => {
  const data = await getPropertiesByProvinceService(req.query.provinceCode);
  return res.status(200).json(data);
};

const editProperty = async (req, res) => {
  const data = await editPropertyService(req.body, req.file);
  return res.status(200).json(data);
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  editProperty,
  getPropertiesByProvince,
};
