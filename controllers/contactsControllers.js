import HttpError from '../helpers/HttpError.js';
import {
  addContact,
  changeContact,
  getContactById,
  listContacts,
  removeContact,
  updateStatusContact,
} from '../services/contactsServices.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite } = req.query;
    const { _id } = req.user;
    console.log(favorite, typeof favorite, !(favorite === 'true'));

    if (
      Number.isNaN(Number(page)) ||
      Number.isNaN(Number(page)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      throw HttpError(400, 'Query "page" & "limit" should be positive numbers');
    }
    if (!(favorite === 'true') && !(favorite === 'false')) {
      throw HttpError(
        400,
        'Query "favorite" should be either "true" or "false"'
      );
    }

    const skip = Number(page) * Number(limit) - Number(limit);

    const data = await listContacts(_id, favorite, skip, Number(limit));

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

export const getOneContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const data = await getContactById(id, _id);

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

export const deleteContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const data = await removeContact(id, _id);

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

export const createContact = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { name, email, phone, favorite = false } = req.body;

    const data = await addContact(name, email, phone, favorite, _id);
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

export const updateContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const data = await changeContact(id, { name, email, phone }, _id);
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

export const patchFavoriteContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const { favorite } = req.body;
    const data = await updateStatusContact(id, favorite, _id);
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
