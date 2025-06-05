const { handleCreateSpecialty, handleGetSpecialty,handleGetDetailSpecialty } = require("../services/specialtyService");

const createSpecialty = async (req, res) => {
  try {
    let data = await handleCreateSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getSpecialty = async (req, res) => {
  try {
    let data = await handleGetSpecialty(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getDetailSpecialty = async (req, res) => {
  try {
    let data = await handleGetDetailSpecialty(req.query.id, req.query.location);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};



module.exports = {
    createSpecialty,
    getSpecialty,
    getDetailSpecialty
};
