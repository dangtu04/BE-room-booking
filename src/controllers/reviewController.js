const { createReviewService, updateReviewService, getReviewsByPropertyIdService } = require("../services/reviewService");

const createReview = async (req, res) => {
  const data = await createReviewService(req.body);
  return res.status(200).json(data);
};

const updateReview = async (req, res) => {
  const data = await updateReviewService(req.body);
  return res.status(200).json(data);
};

const getReviewsByPropertyId = async (req, res) => {
  const data = await getReviewsByPropertyIdService(req.query);
  return res.status(200).json(data);
};



module.exports = { createReview, updateReview, getReviewsByPropertyId };
