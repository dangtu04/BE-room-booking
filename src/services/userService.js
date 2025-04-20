const bcrypt = require("bcryptjs");
const db = require("../models");
const { where } = require("sequelize");
const { raw } = require("body-parser");
const salt = bcrypt.genSaltSync(10);

const handleUserLogin = async (email, password) => {
  try {
    // 1 query duy nhất
    const user = await db.User.findOne({ where: { email } });
    const userData = { errCode: 0, errMessage: "", user: {} };

    if (!user) {
      userData.errCode = 1;
      userData.errMessage = "Email does not exist";
      return userData;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      userData.errCode = 2;
      userData.errMessage = "Wrong password";
      return userData;
    }

    // Lọc ra những trường không cần thiết trước khi trả về client
    const { id, name, email: userEmail, role } = user;
    userData.errMessage = "Login successful!";
    userData.user = { id, name, email: userEmail, role };
    return userData;
  } catch (err) {
    // Có thể log error hoặc transform trước khi throw
    console.error("Login error:", err);
    throw err;
  }
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const hashUserPassword = (pasword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPasword = await bcrypt.hashSync(pasword, salt);
      resolve(hashPasword);
    } catch (e) {
      reject(e);
    }
  });
};

const isValidEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

const createUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check định dạng email
      if (!isValidEmail(data.email)) {
        return resolve({
          errCode: 1,
          errMessage: "Invalid email format!",
        });
      }
      // Check email tồn tại chưa
      const user = await db.User.findOne({ where: { email: data.email } });
      if (user) {
        return resolve({
          errCode: 1,
          mesage: "Email already exists!",
        });
      }

      const hashPaswordFromBcrypt = await hashUserPassword(data.password);

      await db.User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hashPaswordFromBcrypt,
        // dateOfBirth:dateOfBirth,
        address: data.address,
        gender: data.gender,
        role: data.role,
      });
      resolve({
        errCode: 0,
        mesage: "User added successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { id: userId }, raw: false });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "User does not exist!",
        });
      }
      await user.destroy();
      resolve({
        errCode: 0,
        mesage: "User deleted successfully!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const editUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id }, raw : false
      });
      if (!user) {
        return resolve({
          errCode: 2,
          errMessage: "User not found!",
        });
      } 
      if(user) {
        user.firstName = data.firstName,
        user.lastName = data.lastName,
        user.address = data.address,
        user.phoneNumber = data.phoneNumber,
        user.gender = data.gender;
        await user.save();
        resolve({
          errCode: 0,
          message: "User information updated successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createUser,
  deleteUser,
  editUser,
};
