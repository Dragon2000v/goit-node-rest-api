import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import * as authServices from '../services/authServices.js';
import { env } from '../helpers/env.js';
import { subscriptions } from '../helpers/subscriptions.js';
import gravatar from 'gravatar';

import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';

export const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    const filename = `${id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(resultUpload);
    await fs.unlink(tempUpload);

    const avatarURL = `/avatars/${filename}`;
    await authServices.updateUser({ _id: id }, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
      throw HttpError(409, 'Email already in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '250', d: 'retro' }, true);
    const newUser = await authServices.registerUser({
      email,
      password: hashPassword,
      avatarURL,
    });
    res.json({
      status: 201,
      message: 'User successfully registered',
      data: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const JWT_SECRET = env('JWT_SECRET');
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
      throw HttpError(401, 'Email or password invalid');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, 'Email or password invalid');
    }

    const { _id: id } = user;
    const payload = { id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '45m' });

    const updUser = await authServices.updateUser({ _id: id }, { token });
    res.json({
      status: 200,
      data: {
        token,
        user: {
          email: updUser.email,
          subscription: updUser.subscription,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const id = req.user;
    const updUser = await authServices.updateUser({ _id: id }, { token: null });
    res.status(204).json();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const patchSubscriptionUser = async (req, res, next) => {
  try {
    const { id, email } = req.user;
    const { subscription } = req.body;

    if (!subscriptions.includes(subscription)) {
      throw HttpError(
        400,
        `Subscription should be one of the following : ${subscriptions.join(
          ', '
        )}`
      );
    }
    authServices.updateUser({ _id: id }, { subscription });
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
