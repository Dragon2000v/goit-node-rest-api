import { User } from '../db/schemas/User.js';

export async function registerUser({ email, password }) {
  return User.create({ email, password, subscription: 'starter' });
}

export async function findUser(filter) {
  return User.findOne(filter);
}

export async function updateUser(filter, data) {
  return User.findOneAndUpdate(filter, data);
}
