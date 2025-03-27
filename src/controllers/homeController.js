const db = require("../models");

const getHelloWordPage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    res.send("Hello World!");

    console.log(data)
  } catch (error) {
    console.log(error);
  }
};

const  getExamplePage = (req, res) => {
  res.send("Hello World!");
};

module.exports = { getExamplePage, getHelloWordPage };
