import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // FR011: Ensure unique email at DB layer
  },
  password: {
    type: String,
    required: true,
  },
}, { 
  timestamps: true,
  // FR015: Exclude password from responses by default or handle in controller
  toJSON: {
    transform: (doc, ret) => {
      const r = ret as any;
      // remove sensitive fields
      delete r.password;
      // Normalize MongoDB _id to id
      r.id = r._id;
      delete r._id;
      delete r.__v;
    }
  }
});

export const User = mongoose.model('User', userSchema);