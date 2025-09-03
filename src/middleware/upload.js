const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  uploadSingle: upload.single("avatar"),     // cho ảnh đại diện
  uploadMultiple: upload.array("images", 10) // cho nhiều ảnh mô tả
};
