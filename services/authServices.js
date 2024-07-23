import { User } from '../db/schemas/User.js';

export async function registerUser({ email, password, avatarURL }) {
  return User.create({ email, password, subscription: 'starter', avatarURL });
}

export async function findUser(filter) {
  return User.findOne(filter);
}

export async function updateUser(filter, data) {
  return User.findOneAndUpdate(filter, data, { new: true });
}
