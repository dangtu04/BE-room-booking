const db = require("../models");
const { createUser } = require("../services/userService");

const getHelloWordPage = async (req, res) => {
  try {
  
    res.send("Hello World!");
   
  } catch (error) {
    console.log(error);
  }
};

const  getExamplePage = (req, res) => {
  res.send("example!");
};

const getUser = async (req, res) => {
  return res.render('user.ejs')
}

const postUser = async (req, res) => {
  await createUser(req.body)
  return res.send('create user')
}

module.exports = { getExamplePage, getHelloWordPage, getUser, postUser };
