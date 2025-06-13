const {
  handleCreateSpecialty,
  handleGetSpecialty,
  handleGetDetailSpecialty,
  handleUpdateSpecialty,
  handleDeleteSpecialty,
  handleGetSpecialtyById,
  handleSearchSpecialty,
} = require("../services/specialtyService");

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
    let data = await handleGetSpecialty();
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


const getSpecialtyById = async (req, res) => {
  try {
    let data = await handleGetSpecialtyById(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};


const updateSpecialty = async (req, res) => {
  try {
    let data = await handleUpdateSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    let data = await handleDeleteSpecialty(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const searchSpecialty = async (req, res) => {
  try {
    let data = await handleSearchSpecialty(req.query.keyWord);
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
  getDetailSpecialty,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
  searchSpecialty
};
