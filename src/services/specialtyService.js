const db = require("../models");

const handleCreateSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.contentMarkdown ||
        !data.contentHTML
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.image,
          contentMarkdown: data.contentMarkdown,
          contentHTML: data.contentHTML,
        });
        resolve({
          errCode: 0,
          message: "Create specialty successfully!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const handleGetSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      resolve({
        errCode: 0,
        data: specialty,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetDetailSpecialty = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId, !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["contentMarkdown", "contentHTML"],
        });
        if(specialty) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          specialty.doctorSpecialty = doctorSpecialty;
        } else {
          specialty = {};
        }

        resolve({
          errCode: 0,
          data: specialty,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCreateSpecialty,
  handleGetSpecialty,
  handleGetDetailSpecialty,
};
