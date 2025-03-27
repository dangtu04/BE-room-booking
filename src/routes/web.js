const express = require("express");
const router = express.Router();
const { getExamplePage, getHelloWordPage } = require('../controllers/homeController')

router.get("/",getHelloWordPage);

router.get("/example", getExamplePage);

module.exports = router