import Joi from 'joi';

export const registerSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const logOutSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const updateContactSubscriptionSchema = Joi.object().keys({
  subscription: Joi.string().required(),
});
