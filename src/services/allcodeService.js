const { where } = require("sequelize");
const db = require("../models");

const getAllCode = async (inputType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputType) {
        resolve({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({ where: { type: inputType } });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getAllCode };
