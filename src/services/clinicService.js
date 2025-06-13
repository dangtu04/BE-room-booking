const { Op } = require("sequelize");
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


const handleGetClinicById = (inputId) => {
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
          attributes: ["name", "address", "contentMarkdown", "contentHTML", "image"],
        });
        if(!clinic) {
          resolve({
            errCode: 2,
            errMessage: "Clinic not found!",
          });
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

const handleUpdateClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (clinic) {
          clinic.name = data.name;
          clinic.address = data.address;
          clinic.image = data.image;
          clinic.contentMarkdown = data.contentMarkdown;
          clinic.contentHTML = data.contentHTML;

          await clinic.save();
          resolve({
            errCode: 0,
            message: "Update clinic successfully!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Clinic not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}


const handleDeleteClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: id },
        raw: false,
      });
      if (!clinic) {
        resolve({
          errCode: 2,
          errMessage: "Clinic does not exist!",
        });
      }
      await clinic.destroy();
      resolve({
        errCode: 0,
        message: "Clinic deleted successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
}

const handleSearchClinic = async (keyWord) => {
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

    const clinics = await db.Clinic.findAll({
      where: {
        [Op.and]: whereConditions,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "image"],
      },
    });

    if (clinics && clinics.length > 0) {
      return {
        errCode: 0,
        data: clinics,
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Clinic not found!",
      };
    }
  } catch (error) {
    console.error("Error searching clinic:", error);
    return {
      errCode: -1,
      errMessage: "An error occurred while searching for clinic.",
    };
  }
};

module.exports = {
  handleCreateClinic,
  handleGetAllClinic,
  handleGetDetailClinic,
  handleGetClinicById,
  handleUpdateClinic,
  handleDeleteClinic,
  handleSearchClinic
};
