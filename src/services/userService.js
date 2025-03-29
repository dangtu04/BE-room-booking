const bcrypt = require("bcryptjs");
const db = require("../models");
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
                role: data.role,
            })
            resolve('Create user success')
        } catch (error) {
            reject(error)
        }
    })
}

const hashUserPassword = (pasword) => {
    return new Promise(async (resolve, reject) => {{
        try {
            const hashPasword = await bcrypt.hashSync(pasword, salt);
            resolve(hashPasword);
        } catch (e) {
            reject(e);
        }

    }})
}

module.exports = {createUser, hashUserPassword}