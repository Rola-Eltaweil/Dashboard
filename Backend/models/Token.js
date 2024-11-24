import mongoose from 'mongoose'

const Token = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  verificationToken: {
    type: String,
    default: "",
  },
  passwordResetToken: {
    type: String,
    default:"",
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const tokenModel=mongoose.model('token',Token)
export default tokenModel