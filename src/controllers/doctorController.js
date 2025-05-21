const {
  getTopDoctor,
  getDoctor,
  saveDoctorDetail,
  getDoctorDetailById,
} = require("../services/doctorService");

const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) {
    limit = 10;
  }
  try {
    let data = await getTopDoctor(+limit);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from Server...",
    });
  }
};

const getAllDoctor = async (req, res) => {
  try {
    let data = await getDoctor();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from Server...",
    });
  }
};

const postDoctorInfo = async (req, res) => {
  try {
    let response = await saveDoctorDetail(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from Server...",
    });
  }
};

const getDoctorDetail = async (req, res) => {
  try {
    const doctorId = req.query.id;

    if (!doctorId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    }

    let info = await getDoctorDetailById(doctorId);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server...",
    });
  }
};

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  postDoctorInfo,
  getDoctorDetail,
};
