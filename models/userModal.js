import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    username: {
      type: String,
    },
    batch: {
      type: String,
    },
    chest_no: {
      type: String,
    },
    emp_no: {
      type: String,
    },
    player_prefab: {
      type: String,
    },
    player_weight: {
      type: String,
    },
    role: {
      type: String,
      default: "11",
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
