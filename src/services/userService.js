const bcrypt = require("bcryptjs");
const db = require("../models");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { getPropertyIdByOwnerId } = require("./propertyService");

const handleUserLogin = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        let payload = {};

        const property = await getPropertyIdByOwnerId(user.id);

        if (property && property.errCode === 0) {
          payload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            roleCode: user.roleCode,
            propertyId: property.propertyId,
          };
        } else {
          payload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            roleCode: user.roleCode,
          };
        }
      
    
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          errCode: 0,
          message: "Login successfully",
          access_token,
          data: {
            email: user.email,
            fullName: user.fullName,
            roleCode: user.roleCode,
          },
        };
      } else {
        return {
          errCode: 2,
          message: "Wrong password!",
        };
      }
    } else {
      return {
        errCode: 1,
        message: "Invalid email or password",
      };
    }
  } catch (err) {
    console.error("Login error:", err);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

// const getAllUsers = async () => {
//   try {
//     const data = await db.User.findAll({
//       attributes: {
//         exclude: ["password", "createdAt", "updatedAt"],
//       },
//     });
//     return { errCode: 0, message: "Get list user successfully", data };
//   } catch (error) {
//     console.log("Get list user fail: ", error);
//     return null;
//   }
// };

const getAllUsers = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      offset,
      limit,
      order: [["id", "ASC"]],
    });

    return {
      errCode: 0,
      message: "Get list user successfully",
      data: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.log("Get list user fail: ", error);
    return { errCode: 1, message: "Get list user failed", data: [] };
  }
};


const getAllOwners = async () => {
  try {
    const data = await db.User.findAll({
      where: { roleCode: "R2" },
      attributes: ["id", "fullName", "email"],
    });
    return { errCode: 0, message: "Get list owner successfully", data };
  } catch (error) {
    console.log("Get list owner fail: ", error);
    return null;
  }
};

const getUserById = async (userId) => {
  try {
    if (!userId) {
      return { errCode: 1, message: "Missing user ID" };
    }
    const data = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    return { errCode: 0, data };
  } catch (error) {
    console.log("Get user fail: ", error);
    return null;
  }
};

const hashUserPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

const isValidEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

const createUser = async (data) => {
  try {
    // Kiểm tra dữ liệu bắt buộc
    if (!data.fullName || !data.email || !data.password || !data.phoneNumber) {
      return {
        errCode: 1,
        message: "Missing required fields!",
      };
    }

    // Kiểm tra định dạng email
    if (!isValidEmail(data.email)) {
      return {
        errCode: 2,
        message: "Invalid email format!",
      };
    }

    // Kiểm tra email đã tồn tại chưa
    const user = await db.User.findOne({ where: { email: data.email } });
    if (user) {
      return {
        errCode: 3,
        message: "Invalid email or password",
      };
    }

    // Mã hóa mật khẩu
    const hashPassword = await hashUserPassword(data.password);

    // Tạo người dùng mới
    await db.User.create({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashPassword,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
      roleCode: data.roleCode || "R3",
    });

    return {
      errCode: 0,
      message: "User created successfully!",
    };
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await db.User.findOne({ where: { id: userId }, raw: false });
    if (!user) {
      return {
        errCode: 1,
        message: "User does not exist!",
      };
    }
    await user.destroy();
    return {
      errCode: 0,
      message: "User deleted successfully!",
    };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const editUser = async (data) => {
  try {
    const user = await db.User.findOne({ where: { id: data.id }, raw: false });
    if (user) {
      user.fullName = data.fullName;
      user.email = data.email;
      user.phoneNumber = data.phoneNumber;
      user.gender = data.gender;
      user.dateOfBirth = data.dateOfBirth;
      user.roleCode = data.roleCode;
      await user.save();
      return {
        errCode: 0,
        message: "User updated successfully!",
      };
    } else {
      return {
        errCode: 2,
        message: "User does not exist!",
      };
    }
  } catch (error) {
    console.error("Error in editUser:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  getAllOwners,
  createUser,
  deleteUser,
  editUser,
  getUserById,
};
