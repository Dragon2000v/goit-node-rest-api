import Joi from 'joi';

export const createContactSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object()
  .keys({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  })
  .min(1);

export const updateStatusContactSchema = Joi.object().keys({
  favorite: Joi.boolean().required(),
});
