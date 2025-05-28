const db = require("../models");

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

let saveDoctorDetail = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentMarkdown ||
        !inputData.contentHTML ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note
      ) {
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
              attributes: ["priceId", "provinceId", "paymentId", "nameClinic", "addressClinic", "note", "count"],
              include: [
                { model: db.Allcode, as: "priceData", attributes: ["valueEn", "valueVi"]},
                { model: db.Allcode, as: "provinceData", attributes: ["valueEn", "valueVi"]},
                { model: db.Allcode, as: "paymentData", attributes: ["valueEn", "valueVi"]}
              ]
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
        attributes: {exclude: ['id', 'doctorId']},
        include: [
                { model: db.Allcode, as: "priceData", attributes: ["valueEn", "valueVi"]},
                { model: db.Allcode, as: "paymentData", attributes: ["valueEn", "valueVi"]}
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
              attributes: ["priceId", "provinceId", "paymentId", "nameClinic", "addressClinic", "note", "count"],
              include: [
                { model: db.Allcode, as: "priceData", attributes: ["valueEn", "valueVi"]},
                { model: db.Allcode, as: "provinceData", attributes: ["valueEn", "valueVi"]},
                { model: db.Allcode, as: "paymentData", attributes: ["valueEn", "valueVi"]}
              ]
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






module.exports = {
  getTopDoctor,
  getDoctor,
  saveDoctorDetail,
  getDoctorDetailById,
  getDoctorInforExtraByDoctorId,
  getProfileDoctorById
};
