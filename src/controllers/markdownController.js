const { getMarkdownByDoctorId } = require("../services/markdownService");

const handleGetMarkdownByDoctorId = async (req, res) => {
    try {
        let data = await getMarkdownByDoctorId(req.query.doctorId)
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
  handleGetMarkdownByDoctorId,
};
