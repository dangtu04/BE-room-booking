const db = require("../models");
require("dotenv").config();
var _ = require("lodash");
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const handleBulkCreateSchedule = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => ({
            ...item,
            maxNumber: MAX_NUMBER_SCHEDULE,
          }));
        }

        // tìm các lịch đã tồn tại theo doctorId và date
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formattedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        // so sánh schedule và existing, giữ lại những lịch chưa tồn tại
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });

        // thêm các lịch chưa tồn tại và DB
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          message: "Save schedule success!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDoctorScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });

        if(!data) data = [];

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { handleBulkCreateSchedule, getDoctorScheduleByDate };
