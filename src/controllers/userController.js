const {
  handleUserLogin,
  getAllUsers,
  createUser,
  deleteUser,
  editUser,
} = require("../services/userService");

const userLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    userData: userData.user,
  });
};

const handleGetAllUser = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
      users: [],
    });
  }

  let users = await getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

const handleCreateUser = async (req, res) => {
  let message = await createUser(req.body);
  return res.status(200).json({ message });
};

const handleEditUser = async (req, res) => {
  if(!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage:'Missing inputs parameter!'
     });
  }
  let message = await editUser(req.body);
  return res.status(200).json({message})
};

const handleDeleteUser = async (req, res) => {
  if(!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage:'Missing inputs parameter!'
     });
  }
  let message = await deleteUser(req.body.id);
  return res.status(200).json({ message });

};

module.exports = {
  userLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
};
