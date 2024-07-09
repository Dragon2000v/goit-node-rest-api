import { Contact } from '../db/schemas/Contact.js';

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(_id) {
  return Contact.findOne({ _id }) || null;
}

export async function removeContact(_id) {
  return Contact.findByIdAndDelete({ _id });
}

export async function addContact(name, email, phone, favorite) {
  return Contact.create({ name, email, phone, favorite });
}

export async function changeContact(_id, fields) {
  return Contact.findOneAndUpdate({ _id }, fields, { new: true });
}

export async function updateStatusContact(_id, favorite) {
  return Contact.findOneAndUpdate({ _id }, { favorite }, { new: true });
}
