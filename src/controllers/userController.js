const {
  handleUserLogin,
  getAllUsers,
  createUser,
  deleteUser,
  editUser,
  getUserById,
  getAllOwners,
} = require("../services/userService");

const userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  const data = await handleUserLogin(email, password);

  return res.status(200).json(data);
};

const handleGetAllUser = async (req, res) => {
  const data = await getAllUsers();
  return res.status(200).json(data);
};

const handleGetAllOwner = async (req, res) => {
  const data = await getAllOwners();
  return res.status(200).json(data);
};

const handleGetUserById = async (req, res) => {
  const data = await getUserById(req.query.id);
  return res.status(200).json(data);
}

const handleCreateUser = async (req, res) => {
  const data = await createUser(req.body);
  return res.status(200).json(data);
};

const handleEditUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  const data = await editUser(req.body);
  return res.status(200).json(data);
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  const data = await deleteUser(req.body.id);
  return res.status(200).json(data);
};

module.exports = {
  userLogin,
  handleGetAllUser,
  handleGetAllOwner,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  handleGetUserById
};
