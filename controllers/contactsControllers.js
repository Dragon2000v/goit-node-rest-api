import HttpError from '../helpers/HttpError.js';
import {
  addContact,
  changeContact,
  getContactById,
  listContacts,
  removeContact,
  updateStatusContact,
} from '../services/contactsServices.js';

export const checkContactId = async (req, _, next) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    next(HttpError(404, 'Contact not found'));
  } else {
    next();
  }
};

export const getAllContacts = async (_, res) => {
  try {
    const data = await listContacts();
    res.json({
      status: 200,
      message: 'Contacts get successfully',
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getContactById(id);
    res.json({
      status: 200,
      message: `Contact with id ${id} got successfully`,
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await removeContact(id);
    res.json({
      status: 200,
      message: `Contact with id ${id} deleted successfully`,
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, favorite = false } = req.body;
    const data = await addContact(name, email, phone, favorite);
    res.json({
      status: 200,
      message: `Contact created successfully`,
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const data = await changeContact(id, { name, email, phone });
    res.json({
      status: 200,
      message: `Contact updated successfully`,
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const patchFavoriteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const data = await updateStatusContact(id, favorite);
    res.json({
      status: 200,
      message: `Contact favorite status changed successfully`,
      data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
