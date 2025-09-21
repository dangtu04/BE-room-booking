// services/contactService.js
const db = require("../models");

const createContactService = async (data) => {
  try {
    if (!data.contactEmail || !data.message) {
      return {
        errCode: 1,
        message: "Missing required fields!",
      };
    }

    // Kiểm tra email đã tồn tại chưa
    const existing = await db.Contact.findOne({
      where: { contactEmail: data.contactEmail },
    });

    if (existing) {
      return {
        errCode: 2,
        message: "This email has already submitted a contact!",
      };
    }

    const newContact = await db.Contact.create({
      contactEmail: data.contactEmail,
      message: data.message,
    });

    return {
      errCode: 0,
      message: "Contact created successfully!",
      data: newContact,
    };
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      message: "Server error!",
    };
  }
};

const getAllContactsService = async () => {
  try {
    const contacts = await db.Contact.findAll({
      order: [["createdAt", "DESC"]],
    });
    return {
      errCode: 0,
      data: contacts,
    };
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      message: "Server error!",
    };
  }
};

const deleteContactService = async (id) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        message: "Missing contact id!",
      };
    }

    const contact = await db.Contact.findOne({
      where: { id },
       raw: false 
    });
    if (!contact) {
      return {
        errCode: 2,
        message: "Contact not found!",
      };
    }

    await contact.destroy();
    return {
      errCode: 0,
      message: "Contact deleted successfully!",
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
  createContactService,
  getAllContactsService,
  deleteContactService,
};
