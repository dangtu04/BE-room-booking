const {
  bulkAddImagesService,
  deleteImageByPublicId,
  updateImageService,
  getImageByTargetIdService,
  addSingleImageService,
  deleteImageByTargetIdService,
} = require("../services/uploadService");

const bulkAddImages = async (req, res) => {
  const data = await bulkAddImagesService(req.body, req.files);
  return res.status(200).json(data);
};

const deleteImage = async (req, res) => {
  const data = await deleteImageByPublicId(req.body.publicId);
  return res.status(200).json(data);
};

const updateImage = async (req, res) => {
  const data = await updateImageService(req.body);
  return res.status(200).json(data);
};

const getImageByTargetId = async (req, res) => {
  const data = await getImageByTargetIdService(req.query.targetId);
 return res.status(200).json(data);
};


const addSingleImage = async (req, res) => {
  const data = await addSingleImageService(req.body, req.files);
  return res.status(200).json(data);
};

const deleteImageByTargetId = async (req, res) => {
  const data = await deleteImageByTargetIdService(req.body.targetId);
  return res.status(200).json(data);
};

module.exports = {
  bulkAddImages,
  deleteImage,
  updateImage,
  getImageByTargetId,
  addSingleImage, deleteImageByTargetId
};
