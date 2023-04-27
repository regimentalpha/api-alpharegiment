import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsAppNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
    },
    qualification: {
      type: String,
    },
    courseChoice: {
      type: String,
    },
    courseMode: {
      type: String,
    },
    batchTime: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    parentEmail: {
      type: String,
    },
    parentWhatsAppNo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", userSchema);
