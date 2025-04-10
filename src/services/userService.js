const bcrypt = require("bcryptjs");
const db = require("../models");
const { raw } = require("body-parser");
const salt = bcrypt.genSaltSync(10);


const createUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const hashPaswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: hashPaswordFromBcrypt,
                address: data.address,
                gender: data.gender,
                role: data.role,
            })
            resolve('Create user success')
        } catch (error) {
            reject(error)
        }
    })
}

const hashUserPassword = (pasword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasword = await bcrypt.hashSync(pasword, salt);
            resolve(hashPasword);
        } catch (e) {
            reject(e);
        }

    })
}

const getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const users = db.User.findAll(
                {raw: true}
            )
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {createUser, hashUserPassword, getAllUser}