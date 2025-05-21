const db = require("../models");

const getMarkdownByDoctorId = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        let res = {};
        let markdown = await db.Markdown.findOne({
          where: { doctorId: doctorId },
        });
        res.errCode = 0;
        res.data = markdown;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getMarkdownByDoctorId };
