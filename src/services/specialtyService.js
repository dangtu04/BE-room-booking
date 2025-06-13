const { Op } = require("sequelize");
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
      if ((!inputId, !location)) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["contentMarkdown", "contentHTML"],
        });
        if (specialty) {
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

const handleGetSpecialtyById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        if (specialty) {
          resolve({
            errCode: 0,
            data: specialty,
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Specialty not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleUpdateSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (specialty) {
          specialty.name = data.name;
          specialty.image = data.image;
          specialty.contentMarkdown = data.contentMarkdown;
          specialty.contentHTML = data.contentHTML;

          await specialty.save();
          resolve({
            errCode: 0,
            message: "Update specialty successfully!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Specialty not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleDeleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: id },
        raw: false,
      });
      if (!specialty) {
        resolve({
          errCode: 2,
          errMessage: "Specialty not found!",
        });
      }
      await specialty.destroy();
      resolve({
        errCode: 0,
        message: "Delete specialty successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleSearchSpecialty = async (keyWord) => {
  if (!keyWord) {
    return {
      errCode: 1,
      errMessage: "Missing required parameters!",
    };
  }

  try {
    const terms = keyWord.toLowerCase().split(/\s+/);
    const whereConditions = terms.map(term => ({
      name: {
        [Op.like]: `%${term}%`,
      },
    }));

    const specialties = await db.Specialty.findAll({
      where: {
        [Op.and]: whereConditions,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (specialties && specialties.length > 0) {
      return {
        errCode: 0,
        data: specialties,
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Specialty not found!",
      };
    }
  } catch (error) {
    console.error("Error searching specialty:", error);
    return {
      errCode: -1,
      errMessage: "An error occurred while searching for specialty.",
    };
  }
};

module.exports = {
  handleCreateSpecialty,
  handleGetSpecialty,
  handleGetDetailSpecialty,
  handleGetSpecialtyById,
  handleUpdateSpecialty,
  handleDeleteSpecialty,
  handleSearchSpecialty,
};
