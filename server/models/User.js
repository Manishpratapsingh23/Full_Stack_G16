import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['reader', 'book_owner', 'admin'], default: 'reader' }
  },
  { timestamps: true }
);

const User = model('User', userSchema);

export default User;
