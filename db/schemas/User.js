import mongoose, { model } from 'mongoose';
import { mongoSaveError, setMongoUpdateSettings } from './hooks.js';
import { subscriptions } from '../../helpers/subscriptions.js';
import gravatar from 'gravatar';
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptions,
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250', d: 'retro' }, true);
      },
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', mongoSaveError);
userSchema.pre('findOneAndUpdate', setMongoUpdateSettings);
userSchema.post('findOneAndUpdate', mongoSaveError);

export const User = model('user', userSchema);
