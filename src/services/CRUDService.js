const bcrypt = require("bcryptjs");
const db = require("../models");
const { raw } = require("body-parser");
const e = require("express");
const { where } = require("sequelize");
const salt = bcrypt.genSaltSync(10);

const createUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPaswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hashPaswordFromBcrypt,
        address: data.address,
        gender: data.gender,
        role: data.role,
      });
      resolve("Create user success");
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

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = db.User.findAll({ raw: true });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserInfoById = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      let userData = db.User.findOne({ where: { id: userId }, raw: true });
      if (userData) {
        resolve(userData);
      } else {
        reject({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        (user.firstName = data.firstName),
          (user.lastName = data.lastName),
          (user.address = data.address),
          (user.gender = data.gender);

        await user.save();
        let allUsers = db.User.findAll();
        resolve(allUsers);
      } else {
        reject();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });
      if (user) {
        await user.destroy();
        resolve();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

// const handleUserLogin = async (email, password) => {
//   try {
//     // 1 query duy nhất
//     const user = await db.User.findOne({ where: { email } });
//     const userData = { errCode: 0, errMessage: '', user: {} };

//     if (!user) {
//       userData.errCode = 1;
//       userData.errMessage = 'Email does not exist';
//       return userData;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       userData.errCode = 2;
//       userData.errMessage = 'Wrong password';
//       return userData;
//     }

//     // Lọc ra những trường không cần thiết trước khi trả về client
//     const { id, name, email: userEmail, role } = user; 
//     userData.errMessage = 'Login successful!';
//     userData.user = { id, name, email: userEmail, role };
//     return userData;

//   } catch (err) {
//     // Có thể log error hoặc transform trước khi throw
//     console.error('Login error:', err);
//     throw err;
//   }
// };

// const checkUserEmail = (userEmail) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let user = await db.User.findOne({ where: { email: userEmail } });
//       if (user) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = {
  createUser,
  hashUserPassword,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
  // handleUserLogin,
  // checkUserEmail,
};
