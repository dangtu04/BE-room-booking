const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const db = require("../models");

const uploadToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};



const addSingleImageService = async (data, file) => {
  try {
    if (!data.type || !data.targetId || !data.folder || !file) {
      return {
        errCode: 1,
        message: "Missing inputs parameter!",
      };
    }
    // Upload ảnh lên Cloudinary
    const result = await uploadToCloudinary(file.buffer, data.folder);

    // Lưu thông tin ảnh vào database
    await db.Image.create({
      type: data.type,
      targetId: data.targetId,
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      errCode: 0,
      message: "Add image successfully",
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Add single image error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};



const bulkAddImagesService = async (data, files) => {
  try {
    if (!data.type || !data.targetId || !data.folder) {
      return {
        errCode: 1,
        message: "Missing inputs parameter!",
      };
    }

    if (files) {
      const uploadResults = [];
      // lặp qua từng file
      for (const file of files) {
        const result = await uploadToCloudinary(file.buffer, data.folder);
        uploadResults.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
      // chuẩn bị mảng cho bulk create
      const imageData = uploadResults.map((result) => ({
        type: data.type,
        targetId: data.targetId,
        url: result.secure_url,
        publicId: result.public_id,
      }));

      await db.Image.bulkCreate(imageData);

      return {
        errCode: 0,
        message: "Bulk add images successfully",
      };
    }
  } catch (error) {
    console.log("Bulk add images error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const updateImageService = async (data) => {
  try {
    const image = await db.Image.findOne({
      where: { targetId: data.targetId },
      raw: false,
    });
    if (image) {
      image.url = data.url;
      image.publicId = data.publicId;
      await image.save();
      return {
        errCode: 0,
        message: "Update image successfully",
      };
    } else {
      return {
        errCode: 2,
        message: "Image not found!",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const deleteImageByPublicId = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log('check result delete: ', result.result)
    return result.result;
  } catch (error) {
    console.error("Lỗi khi xoá ảnh:", error);
    throw error;
  }
};



const getImageByTargetIdService = async (targetId) => {
  try {
    if (!targetId) {
      return {
        errCode: 1,
        message: "Missing targetId parameter!",
        images: {},
      };
    }
    const data = await db.Image.findOne({
      where: { targetId },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      raw: true,
    });
    return {
      errCode: 0,
      message: "Get image successfully",
      data,
    };
  } catch (error) {
    console.error("Error getting image by targetId:", error);
    return {
      errCode: -1,
      message: "Server error",
      data: {},
    };
  }
};


const deleteImageByTargetIdService = async (targetId) => {
  try {
    if (!targetId) {
      return {
        errCode: 1,
        message: "Missing targetId parameter!",
      };
    }
    const image = await db.Image.findOne({ where: { targetId } });
    if (!image) {
      return {
        errCode: 2,
        message: "Image not found!",
      };
    }
    // Xoá ảnh trên Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    // Xoá record trong database
    await db.Image.destroy({ where: { targetId } });
    return {
      errCode: 0,
      message: "Delete image successfully",
    };
  } catch (error) {
    console.error("Error deleting image by targetId:", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const deleteImageByIdService = async (id) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        message: "Missing id parameter!",
      };
    }
    const image = await db.Image.findOne({ where: { id } });
    if (!image) {
      return {
        errCode: 2,
        message: "Image not found!",
      };
    }
    // xoá trên cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    await db.Image.destroy({ where: { id } });
    return {
      errCode: 0,
      message: "Delete image successfully",
    };
  } catch (error) {
    console.error("Error deleting image by id:", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};
module.exports = {
  uploadToCloudinary,
  bulkAddImagesService,
  deleteImageByPublicId,
  updateImageService,
  getImageByTargetIdService,
  addSingleImageService,
  deleteImageByTargetIdService,
  deleteImageByIdService
};
