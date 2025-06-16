const { Op } = require("sequelize");
const db = require("../models");
const { sendAttachment } = require("./emailService");

const getTopDoctor = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let checkRequiredFields = () => {
  let arr = [
    "doctorId",
    "contentMarkdown",
    "contentHTML",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "doctorId",
  ];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      return false;
    }
  }
};

let saveDoctorDetail = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (checkRequiredFields() === false) {
        reject({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            await doctorMarkdown.save();
          }
        }

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });

        if (doctorInfor) {
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            doctorId: inputData.doctorId,
            clinicId: inputData.clinicId,
          });
        }

        resolve({
          errCode: 0,
          message: "Doctor information saved successfully!",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getDoctorDetailById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentMarkdown", "contentHTML", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              as: "doctorInfor",
              attributes: [
                "priceId",
                "provinceId",
                "paymentId",
                "nameClinic",
                "addressClinic",
                "doctorId",
                "clinicId",
                "note",
                "count",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getDoctorInforExtraByDoctorId = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let infor = await db.Doctor_Infor.findOne({
        where: { doctorId },
        attributes: { exclude: ["id", "doctorId"] },
        include: [
          {
            model: db.Allcode,
            as: "priceData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "paymentData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: infor,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findOne({
        where: { id: doctorId },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Doctor_Infor,
            as: "doctorInfor",
            attributes: [
              "priceId",
              "provinceId",
              "paymentId",
              "nameClinic",
              "addressClinic",
              "note",
              "count",
            ],
            include: [
              {
                model: db.Allcode,
                as: "priceData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "provinceData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "paymentData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let handleGetListPatient = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: { doctorId: doctorId, date: date, statusId: "S2" },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "firstName",
                "lastName",
                "email",
                "address",
                "gender",
                "phoneNumber",
                "dateOfBirth",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let handleSendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
          await sendAttachment(data);
          resolve({
            errCode: 0,
            Message: "Send remedy successfully!",
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const handleSearchDoctor = async (keyWord) => {
  if (!keyWord) {
    return {
      errCode: 1,
      errMessage: "Missing required parameters!",
    };
  }

  try {
    const terms = keyWord.toLowerCase().split(/\s+/);
    const whereConditions = terms.map((term) => ({
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${term}%`,
          },
        },
        {
          lastName: {
            [Op.like]: `%${term}%`,
          },
        },
      ],
    }));

    const doctors = await db.User.findAll({
      where: {
        [Op.and]: [...whereConditions, { roleId: "R2" }],
      },
      attributes: ["id", "firstName", "lastName", "image"],
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (doctors && doctors.length > 0) {
      return {
        errCode: 0,
        data: doctors,
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Doctor not found!",
      };
    }
  } catch (error) {
    console.error("Error searching doctor:", error);
    return {
      errCode: -1,
      errMessage: "An error occurred while searching for doctor.",
    };
  }
};

let getAllDoctorForChatbot = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: ["id", "firstName", "lastName"],
        include: [
          {
            model: db.Doctor_Infor,
            as: "doctorInfor",
            attributes: ["specialtyId", "clinicId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
              {
                model: db.Clinic,
                as: "clinicData",
                attributes: ["name"],
              },
            ],
          },
          {
            model: db.Markdown,
            attributes: ["contentHTML", "description"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctor,
  getDoctor,
  saveDoctorDetail,
  getDoctorDetailById,
  getDoctorInforExtraByDoctorId,
  getProfileDoctorById,
  handleGetListPatient,
  handleSendRemedy,
  handleSearchDoctor,
  getAllDoctorForChatbot,
};
