const db = require("../models");

const upsertAboutService = async (data) => {
  try {
    if (!data.contentMarkdown || !data.contentHTML) {
      return {
        errCode: 1,
        message: "Missing required fields!",
      };
    }

    // kt xem có chưa
    let about = await db.About.findOne({raw: false});
 
    if (about) {
      // update nếu đã tồn tại
      about.contentMarkdown = data.contentMarkdown;
      about.contentHTML = data.contentHTML;
      await about.save();
      return {
        errCode: 0,
        message: "About updated successfully!"
      };
    } else {
      // tạo mới nếu chưa có
      const newAbout = await db.About.create({
        contentMarkdown: data.contentMarkdown,
        contentHTML: data.contentHTML,
      });
      return {
        errCode: 0,
        message: "About created successfully!"
      };
    }
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      message: "Server error!",

    };
  }
};

const getAboutService = async () => {
  try {
    const about = await db.About.findOne();
    return {
      errCode: 0,
      data: about || {},
    };
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      message: "Server error!",
    };
  }
};


module.exports = {
  upsertAboutService,
  getAboutService,
};
