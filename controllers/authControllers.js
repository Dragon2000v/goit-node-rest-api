import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import * as authServices from '../services/authServices.js';
import { env } from '../helpers/env.js';
import { subscriptions } from '../helpers/subscriptions.js';
import Jimp from 'jimp';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { sendMail } from '../helpers/sendEmail.js';

const avatarsPath = path.resolve('public', 'avatars');

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
      throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { size: '100' });
    const verificationToken = nanoid(12);
    const newUser = await authServices.registerUser({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const BASE_URL = env('BASE_URL');
    const data = {
      to: email,
      subject: 'Confirm your registration in Contact List app',
      text: 'Press on the link to confirm your email',
      html: `Good day! Please click on the following link to confirm your account in Contact List app. <a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">Confirm my mail</a>`,
    };
    await sendMail(data);

    res.json({
      status: 201,
      message: 'User successfully registered',
      data: {
        email: newUser.email,
        subscription: newUser.subscription,
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

    if (!user.verify) {
      throw HttpError(
        400,
        'User mail is not verified, please check your mail for following instructions'
      );
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
    res.json({ status: 200 });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      status: 200,
      data: { email, subscription },
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
    res.json({
      status: 200,
      data: { email, subscription },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const patchAvatarUser = async (req, res, next) => {
  try {
    const { path: oldPath, filename } = req.file;
    const { id } = req.user;
    const newPath = path.join(avatarsPath, filename);
    console.log(newPath);
    await fs.rename(oldPath, newPath);

    await Jimp.read(newPath).then(img => img.resize(250, 250));

    const avatarURL = path.join('avatars', filename);
    authServices.updateUser({ _id: id }, { avatarURL });

    res.json({
      status: 200,
      data: {
        avatarURL: `/avatars/${filename}`,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    const user = await authServices.findUser({
      verificationToken,
    });
    if (!user) {
      throw HttpError(400, 'Invalid verification token');
    }
    if (user.verify) {
      throw HttpError(400, 'Verification has already been passed');
    }
    await authServices.updateUser(
      { verificationToken },
      { verificationToken: 'User verified', verify: true }
    );
    res.json({
      status: 200,
      message: 'Verification successful',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resendVerifyMessage = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServices.findUser({
      email,
    });

    if (!user) {
      throw HttpError(400, 'Invalid verification token');
    }
    if (user.verify) {
      throw HttpError(400, 'Verification has already been passed');
    }
    const verificationToken = nanoid(12);
    await authServices.updateUser({ email }, { verificationToken });
    const BASE_URL = env('BASE_URL');
    const data = {
      to: email,
      subject: 'Confirm your registration in Contact List app',
      text: 'Press on the link to confirm your email',
      html: `Good day! Please click on the following link to confirm your account in Contact List app. <a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">Confirm my mail</a>`,
    };
    await sendMail(data);

    res.json({
      status: 200,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
