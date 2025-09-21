const {
  upsertAboutService,
  getAboutService,
} = require("../services/aboutService");

const upsertAbout = async (req, res) => {
  const data = await upsertAboutService(req.body);
  return res.status(200).json(data);
};

const getAbout = async (req, res) => {
  const data = await getAboutService();
  return res.status(200).json(data);
};

module.exports = {
  upsertAbout,
  getAbout,
};
