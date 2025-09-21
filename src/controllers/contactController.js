const {
  createContactService,
  getAllContactsService,
  deleteContactService,
} = require("../services/contactService");

const createContact = async (req, res) => {
  const result = await createContactService(req.body);
  return res.status(200).json(result);
};

const getAllContacts = async (req, res) => {
  const result = await getAllContactsService();
  return res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const result = await deleteContactService(req.body.id);
  return res.status(200).json(result);
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
};
