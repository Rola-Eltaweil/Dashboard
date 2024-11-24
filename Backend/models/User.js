import mongoose from "mongoose"

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/gradient-coding-logo-template_23-2148809439.jpg?t=st=1731357775~exp=1731361375~hmac=65a7eb40fddded83fff9bad7636fe13c975cdc7fdcaeab656765fa09f697b42c&w=740",
    },
    bio: {
      type: String,
      default: "Iam anew user",
    },
    role: {
      type: [String],
      enum: ["admin", "user", "creator"],
      default: "user",
    },
    isVerifed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

const UserModel=mongoose.model('user',userModel)
export default UserModel