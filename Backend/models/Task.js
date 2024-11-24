import mongoose from "mongoose";

const Task = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    proireties: {
      type: String,
      enum: ["Low", "Meduim", "High"],
      default: "Low",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, minimize: true }
);

const TaskModel=mongoose.model('Tasks',Task)
export default TaskModel