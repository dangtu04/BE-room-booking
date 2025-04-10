const express = require("express");
const router = express.Router();
const { getExamplePage, getHelloWordPage, getUser, postUser, displayAllUser } = require('../controllers/userController')

// router.get("/",getHelloWordPage);

// router.get("/example", getExamplePage);

// module.exports = router


let initWebRoutes = (app) => {
    router.get("/", getHelloWordPage);
    router.get("/example", getExamplePage);
    router.get("/user", getUser);
    router.post('/post-user', postUser);
    router.get('/get-user', displayAllUser)
    return app.use('/', router);
}

module.exports = initWebRoutes;