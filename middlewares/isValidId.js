import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';
import { getContactById } from '../services/contactsServices.js';

export const isValidId = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} is not a valid id`));
  }

  const contact = await getContactById(id);
  if (!contact) {
    return next(HttpError(404, `Contact ${id} not found`));
  }

  next();
};
