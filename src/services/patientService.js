const db = require("../models");
const { sendSimpleEmail } = require("./emailService");
const { v4: uuidv4 } = require("uuid");

const isValidEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

const postBookingAppointmentService = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.dateOfBirth ||
        !data.timeType ||
        !data.reason ||
        !data.firstName ||
        !data.lastName ||
        !data.address ||
        !data.phoneNumber ||
        !data.selectedGender
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        if (!isValidEmail(data.email)) {
          return resolve({
            errCode: 1,
            errMessage: "Invalid email format!",
          });
        }

        let token = uuidv4();

        await sendSimpleEmail({
          reciverEmail: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,

          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.selectedGender,
            dateOfBirth: data.dateOfBirth,
            roleId: "R3",
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              reason: data.reason,
              token: token,
            },
          });
        }

        resolve({
          errCode: 0,
          message: "Booking appointment successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const postVerifyBookingAppointmentService = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing inputs parameter!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();

          resolve({
            errCode: 0,
            message: "Booking appointment confirmed successfully!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Booking appointment not found or already confirmed!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postBookingAppointmentService,
  postVerifyBookingAppointmentService,
};
