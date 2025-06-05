const db = require("../models");

const handleCreateClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.address ||
        !data.contentMarkdown ||
        !data.contentHTML
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.image,
          contentMarkdown: data.contentMarkdown,
          contentHTML: data.contentHTML,
        });
        resolve({
          errCode: 0,
          message: "Create clinic successfully!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const handleGetAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "contentMarkdown", "contentHTML"],
        },
      });
      resolve({
        errCode: 0,
        data: clinic,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetDetailClinic = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: ["contentMarkdown", "contentHTML"],
        });
        if (clinic) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: inputId },
            attributes: ["doctorId", "provinceId"],
          });

          clinic.doctorClinic = doctorClinic;
        } else {
          clinic = {};
        }

        resolve({
          errCode: 0,
          data: clinic,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCreateClinic,
  handleGetAllClinic,
  handleGetDetailClinic,
};
