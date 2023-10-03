import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    reqquired: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: { values: ["user", "admin"] },
    required: true,
  },
  confirmEmail: {
    type: Boolean,
    required: true,
  },
});

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
