const express = require("express");
const router = express.Router();
const {
  getExamplePage,
  getHelloWordPage,
  getUser,
  postUser,
  displayAllUser,
  getEditUser,
  putUser,
  deleteUser,
} = require("../controllers/CRUDController");
const {
  userLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
} = require("../controllers/userController");
const { handleGetAllCode } = require("../controllers/allcodeController");
const {
  getTopDoctorHome,
  getAllDoctor,
  postDoctorInfo,
  getDoctorDetail,
  getDoctorInforExtra,
  getProfileDoctor,
  getListPatientForDoctor,
  sendRemedy,
  searchDoctor,
} = require("../controllers/doctorController");
const {
  handleGetMarkdownByDoctorId,
} = require("../controllers/markdownController");
const {
  bulkCreateSchedule,
  getDoctorSchedule,
} = require("../controllers/scheduleController");
const { postBookingAppointment, postVerifyBookingAppointment, getAppointmentHistory } = require("../controllers/patientController");
const { createSpecialty, getSpecialty, getDetailSpecialty, getSpecialtyById, updateSpecialty, deleteSpecialty, searchSpecialty } = require("../controllers/specialtyController");
const { createClinic, getAllClinic, getDetailClinic, getClinicById, updateClinic, deleteClinic, searchClinic } = require("../controllers/clinicController");
const { chatbotController } = require("../controllers/chatbotController");

// router.get("/",getHelloWordPage);

// router.get("/example", getExamplePage);

// module.exports = router

let initWebRoutes = (app) => {
  router.get("/", getHelloWordPage);
  router.get("/example", getExamplePage);
  router.get("/user", getUser);
  router.post("/post-user", postUser);
  router.get("/get-user", displayAllUser);
  router.get("/edit-user", getEditUser);
  router.post("/put-user", putUser);
  router.get("/delete-user", deleteUser);

  // user
  router.post("/api/login", userLogin);
  router.get("/api/get-users", handleGetAllUser);
  router.post("/api/create-user", handleCreateUser);
  router.put("/api/edit-user", handleEditUser);
  router.delete("/api/delete-user", handleDeleteUser);

  // allCode
  router.get("/api/allcode", handleGetAllCode);

  // doctor
  router.get("/api/get-top-doctor", getTopDoctorHome);
  router.get("/api/get-all-doctor", getAllDoctor);
  router.post("/api/save-doctor-info", postDoctorInfo);
  router.get("/api/get-doctor-detail", getDoctorDetail);
  router.get("/api/get-list-patient-for-doctor", getListPatientForDoctor);
  router.post("/api/send-remedy", sendRemedy);
  router.get("/api/search-doctor", searchDoctor);
  


  // markdown
  router.get("/api/get-markdown-by-doctorid", handleGetMarkdownByDoctorId);

  // schedule
  router.post("/api/bulk-create-schedule", bulkCreateSchedule);
  router.get("/api/get-doctor-schedule", getDoctorSchedule);

  // doctor_infor
  router.get("/api/get-doctor-infor-extra", getDoctorInforExtra);
  router.get("/api/get-profile-doctor", getProfileDoctor);

  // patient
  router.post("/api/patient-book-appointment", postBookingAppointment);
  router.post("/api/verify-book-appointment", postVerifyBookingAppointment);
  router.get("/api/get-appointment-history", getAppointmentHistory);

  // specialty
  router.post("/api/create-specialty", createSpecialty);
  router.get("/api/get-specialty", getSpecialty);
  router.get("/api/get-detail-specialty",getDetailSpecialty);
  router.get("/api/get-specialty-by-id", getSpecialtyById);
  router.post("/api/update-specialty", updateSpecialty);
  router.delete("/api/delete-specialty", deleteSpecialty);
  router.get("/api/search-specialty", searchSpecialty);
  // clinic
  router.post("/api/create-clinic", createClinic);
  router.get("/api/get-clinic", getAllClinic);
  router.get("/api/get-detail-clinic",getDetailClinic);
  router.get("/api/get-clinic-by-id", getClinicById);
  router.post("/api/update-clinic", updateClinic);
  router.delete("/api/delete-clinic", deleteClinic);
  router.get("/api/search-clinic", searchClinic);


  // chatbot
  router.post("/api/chatbot", chatbotController);

  return app.use("/", router);
};

module.exports = initWebRoutes;
