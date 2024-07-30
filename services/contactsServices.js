import { Contact } from '../db/schemas/Contact.js';

export async function listContacts(owner, favorite, skip, limit) {
  console.log(skip, limit);
  if (favorite) {
    return Contact.find({ owner, favorite }, {}, { skip, limit });
  } else {
    return Contact.find({ owner }, {}, { skip, limit });
  }
}

export async function getContactById(_id, owner) {
  return Contact.findOne({ _id, owner });
}

export async function removeContact(_id, owner) {
  return Contact.findByIdAndDelete({ _id, owner });
}

export async function addContact(name, email, phone, favorite, owner) {
  return Contact.create({ name, email, phone, favorite, owner });
}

export async function changeContact(_id, fields, owner) {
  return Contact.findByIdAndUpdate({ _id, owner }, fields, { new: true });
}

export async function updateStatusContact(_id, favorite, owner) {
  return Contact.findByIdAndUpdate({ _id, owner }, { favorite }, { new: true });
}
