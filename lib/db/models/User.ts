import mongoose, { Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: [5, "Please enter a valid email address"],
      maxlength: [255, "Email must be under 255 characters"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // never returned by default; explicitly select("+password") when verifying.
      select: false,
    },
    name: {
      type: String,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be at most 30 characters"],
      trim: true,
    },
  },
  { timestamps: true },
);

// Hash only when the password actually changed, so unrelated saves do not re-hash.
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
