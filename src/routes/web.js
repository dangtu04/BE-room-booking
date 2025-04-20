const express = require("express");
const router = express.Router();
const { getExamplePage, getHelloWordPage, getUser, postUser, displayAllUser, getEditUser, putUser, deleteUser } = require('../controllers/CRUDController');
const { userLogin, handleGetAllUser, handleCreateUser, handleEditUser, handleDeleteUser } = require("../controllers/userController");

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

    router.post('/api/login', userLogin)
    router.get('/api/get-users', handleGetAllUser)
    router.post('/api/create-user', handleCreateUser)
    router.put('/api/edit-user', handleEditUser)
    router.delete('/api/delete-user', handleDeleteUser)

    return app.use('/', router);
}

module.exports = initWebRoutes;