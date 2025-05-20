const { getAllCode } = require("../services/allcodeService");

const handleGetAllCode = async (req, res) => {
    try {
        let data = await getAllCode(req.query.type)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Error from server: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from server!'
        })
    }
};

module.exports = {
  handleGetAllCode,
};
