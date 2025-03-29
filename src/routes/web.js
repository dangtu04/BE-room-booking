const express = require("express");
const router = express.Router();
const { getExamplePage, getHelloWordPage, getUser, postUser } = require('../controllers/userController')

// router.get("/",getHelloWordPage);

// router.get("/example", getExamplePage);

// module.exports = router


let initWebRoutes = (app) => {
    router.get("/", getHelloWordPage);
    router.get("/example", getExamplePage);
    router.get("/user", getUser);
    router.post('/post-user', postUser)
    return app.use('/', router);
}

module.exports = initWebRoutes;