const {
  savePropertyAmenityService,
  getPropertyAmenitiesByPropertyIdService,
} = require("../services/propertyAmenityService");

const savePropertyAmenity = async (req, res) => {
  const data = await savePropertyAmenityService(req.body);
  return res.status(200).json(data);
};

const getPropertyAmenitiesByPropertyId = async (req, res) => {
  const data = await getPropertyAmenitiesByPropertyIdService(req.query.propertyId);
  return res.status(200).json(data);
};
module.exports = {
  savePropertyAmenity,
  getPropertyAmenitiesByPropertyId
};
