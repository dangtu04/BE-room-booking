const { at } = require("lodash");
const db = require("../models");
const {
  uploadToCloudinary,
  deleteImageByPublicId,
} = require("./uploadService");
const { Op, fn, col } = require("sequelize");

const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return {
        isValid: false,
        message: `Missing required field: ${field}`,
      };
    }
  }
  return { isValid: true };
};

const createPropertyService = async (data, file) => {
  try {
    const requiredFields = [
      "name",
      "provinceCode",
      "address",
      "typeCode",
      "ownerId",
      "checkInTimeCode",
      "checkOutTimeCode",
    ];

    const { isValid, message } = validateRequiredFields(data, requiredFields);
    if (!isValid) {
      return {
        errCode: 1,
        message,
      };
    }

    let avatarUrl = null;
    let public_id = null;
    if (file) {
      // console.log('check file buffer: ', file.buffer)
      const result = await uploadToCloudinary(file.buffer, "properties");
      avatarUrl = result.secure_url;
      public_id = result.public_id;
    }
    await db.Property.create({
      name: data.name,
      provinceCode: data.provinceCode,
      address: data.address,
      typeCode: data.typeCode,
      ownerId: data.ownerId,
      checkInTimeCode: data.checkInTimeCode,
      checkOutTimeCode: data.checkOutTimeCode,
      contentMarkdown: data.contentMarkdown || null,
      contentHTML: data.contentHTML || null,
      avatar: avatarUrl || null,
      public_id: public_id || null,
    });

    return {
      errCode: 0,
      message: "Create Property successfully",
    };
  } catch (error) {
    console.log("Create Property error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getAllPropertiesService = async () => {
  try {
    const data = await db.Property.findAll({
      attributes: ["id", "name", "address", "avatar"],
      include: [
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "typeData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (data) {
      return {
        errCode: 0,
        message: "Get all properties successfully",
        data: data,
      };
    }
  } catch (error) {
    console.log("Get all properties error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};



const getPropertyByIdService = async (propertyId) => {
  try {
    if (!propertyId) {
      return {
        errCode: 1,
        message: "Missing PropertyId",
      };
    }

    const data = await db.Property.findOne({
      where: { id: propertyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "typeData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "checkInTimeData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "checkOutTimeData",
          attributes: ["valueEn", "valueVi"],
        },

        {
          model: db.Review,
          attributes: [
            [fn("AVG", col("Reviews.rating")), "avgRating"],
            [fn("COUNT", col("Reviews.id")), "totalRating"],
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    if (data) {
      return {
        errCode: 0,
        message: "Get property successfully",
        data,
      };
    } else {
      return {
        errCode: 2,
        message: "Property not found!",
      };
    }
  } catch (error) {
    console.log("Get property error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};


const editPropertyService = async (data, file) => {
  try {
    const property = await db.Property.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (property) {
      let publicIdToDelete = null;
      if (property.public_id) {
        publicIdToDelete = property.public_id;
      }

      let avatarUrl = null;
      let public_id = null;
      if (file) {
        const result = await uploadToCloudinary(file.buffer, "properties");
        avatarUrl = result.secure_url;
        public_id = result.public_id;
      }

      property.name = data.name;
      property.provinceCode = data.provinceCode;
      property.address = data.address;
      property.typeCode = data.typeCode;
      property.ownerId = data.ownerId;
      property.contentMarkdown = data.contentMarkdown;
      property.contentHTML = data.contentHTML;
      property.checkInTimeCode = data.checkInTimeCode;
      property.checkOutTimeCode = data.checkOutTimeCode;
      if (avatarUrl && public_id) {
        // console.log("up ảnh")
        property.avatar = avatarUrl;
        property.public_id = public_id;
      }

      await property.save();
      if (file && publicIdToDelete) {
        // console.log("xoá ảnh")
        await deleteImageByPublicId(publicIdToDelete);
      }
      return {
        errCode: 0,
        message: "Property updated successfully!",
      };
    } else {
      return {
        errCode: 2,
        message: "Property does not exist!",
      };
    }
  } catch (error) {
    console.error("Error in edit Property:", error);
    return {
      errCode: -1,
      message: "Internal server error",
    };
  }
};

const getPropertiesByProvinceService = async (provinceCode) => {
  try {
    if (!provinceCode) {
      return {
        errCode: 1,
        message: "Mising provinceCode",
      };
    }
    const data = await db.Property.findAll({
      where: { provinceCode: provinceCode },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (data) {
      return {
        errCode: 0,
        message: "Get properties successfully",
        data: data,
      };
    } else {
      return {
        errCode: 2,
        message: "Property not found!",
      };
    }
  } catch (error) {
    console.log("Get property error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getImagesPropertyService = async (targetId) => {
  try {
    if(!targetId){
      return {
        errCode: 1,
        message: "Mising targetId",
      }
    } else {
      const data = await db.Image.findAll({
        where: { 
          targetId: targetId,
          type: 'PROPERTY'
         },
         attributes: {
          exclude: ["createdAt", "updatedAt"],
         }

      })
      return {
        errCode: 0,
        message: "Get images property successfully",
        data: data
      }
    }
  } catch (error) {
    console.log("Get images property error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
}

const getPropertyIdByOwnerId = async (ownerId) => {
  try {
    const property = await db.Property.findOne({
      where: { ownerId },
      attributes: ["id"],
    });

    if (!property) {
      return {
        errCode: 1,
        message: "No property found for this owner",
      };
    }

    return {
      errCode: 0,
      propertyId: property.id,
    };
  } catch (error) {
    console.log("Get propertyId by ownerId error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

module.exports = {
  createPropertyService,
  getAllPropertiesService,
  getPropertyByIdService,
  editPropertyService,
  getPropertiesByProvinceService,
  getImagesPropertyService,
  getPropertyIdByOwnerId
};
