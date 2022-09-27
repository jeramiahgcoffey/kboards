import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    minlength: [5, 'Please enter a valid email address'],
    maxlength: [255, 'Please enter less than 255 characters'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [30, 'Name must be at most 12 characters'],
    trim: true,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
