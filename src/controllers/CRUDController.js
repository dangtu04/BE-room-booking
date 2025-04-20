const db = require("../models");
const {
  createUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
  handleUserLogin,
} = require("../services/CRUDService");

const getHelloWordPage = async (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    console.log(error);
  }
};

const getExamplePage = (req, res) => {
  res.send("example!");
};

const getUser = async (req, res) => {
  return res.render("user.ejs");
};

const postUser = async (req, res) => {
  await createUser(req.body);
  return res.send("create user");
};

const displayAllUser = async (req, res) => {
  let data = await getAllUser();
  return res.render("displayAlluser.ejs", {
    userTable: data,
  });
};

const getEditUser = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await getUserInfoById(userId);
    return res.render("editUser.ejs", { user: userData });
  } else {
    return res.send("User not found");
  }
};

const putUser = async (req, res) => {
  let data = req.body;
  let user = await updateUserData(data);
  return res.render("displayAlluser.ejs", {
    userTable: user,
  });
};

const deleteUser = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    await deleteUserById(userId);
    return res.send("deleted user");
  } else {
    return res.send("User not found");
  }
};

// const userLogin = async (req, res) => {
//   let email = req.body.email;
//   let password = req.body.password;

//   if (!email || !password) {
//     return res.status(500).json({
//       errCode: 1,
//       message: "Missing inputs parameter!",
//     });
//   }
//   let userData = await handleUserLogin(email, password);

//   return res.status(200).json({
//     errCode: userData.errCode,
//     message: userData.errMessage,
//     userData,
//   });
// };


// const handleGetAllUser = async (req, res) => {
//   let id = req.body.id;
//   let users = await getAllUser(id);



//   return res.status(200).json({
//     errCode: 0,
//     errMessage:'OK',
//     users,
//   })
// }


module.exports = {
  getExamplePage,
  getHelloWordPage,
  getUser,
  postUser,
  displayAllUser,
  getEditUser,
  putUser,
  deleteUser,
  // userLogin,
  // handleGetAllUser
};
