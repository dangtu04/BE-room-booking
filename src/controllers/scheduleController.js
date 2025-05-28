const {
  handleBulkCreateSchedule,
  getDoctorScheduleByDate,
} = require("../services/scheduleService");

const bulkCreateSchedule = async (req, res) => {
  try {
    let data = await handleBulkCreateSchedule(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getDoctorSchedule = async (req, res) => {
  try {
    let data = await getDoctorScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log("Error from server: ", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

module.exports = {
  bulkCreateSchedule,
  getDoctorSchedule,
};
