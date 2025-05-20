const express = require("express");
const router = express.Router();
const { getExamplePage, getHelloWordPage, getUser, postUser, displayAllUser, getEditUser, putUser, deleteUser } = require('../controllers/CRUDController');
const { userLogin, handleGetAllUser, handleCreateUser, handleEditUser, handleDeleteUser } = require("../controllers/userController");
const { handleGetAllCode } = require("../controllers/allcodeController");
const { getTopDoctorHome, getAllDoctor, postDoctorInfo, getDetailDoctor } = require("../controllers/doctorController");

// router.get("/",getHelloWordPage);

// router.get("/example", getExamplePage);

// module.exports = router


let initWebRoutes = (app) => {
    router.get("/", getHelloWordPage);
    router.get("/example", getExamplePage);
    router.get("/user", getUser);
    router.post('/post-user', postUser);
    router.get('/get-user', displayAllUser);
    router.get('/edit-user', getEditUser);
    router.post('/put-user', putUser)
    router.get('/delete-user', deleteUser)

    // user
    router.post('/api/login', userLogin)
    router.get('/api/get-users', handleGetAllUser)
    router.post('/api/create-user', handleCreateUser)
    router.put('/api/edit-user', handleEditUser)
    router.delete('/api/delete-user', handleDeleteUser)

    // allCode
    router.get('/api/allcode', handleGetAllCode)

    // doctor
    router.get('/api/get-top-doctor', getTopDoctorHome)
    router.get('/api/get-all-doctor', getAllDoctor)
    router.post('/api/save-doctor-info', postDoctorInfo)
    router.get('/api/get-detail-doctor', getDetailDoctor)



    return app.use('/', router);
}

module.exports = initWebRoutes;