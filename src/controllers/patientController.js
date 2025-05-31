const { postBookingAppointmentService, postVerifyBookingAppointmentService } = require("../services/patientService");

const postBookingAppointment = async (req, res) => {
    try {
        let data = await postBookingAppointmentService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Error from server: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from server!'
        })
    }
};

const postVerifyBookingAppointment = async (req, res) => {
   try {
        let data = await postVerifyBookingAppointmentService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Error from server: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from server!'
        })
    }
}

module.exports = {
  postBookingAppointment,
  postVerifyBookingAppointment
};
