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
    device_code: {
      type: Number,
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
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
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
    device_code: {
      type: Number,
    },
    joining_date: {
      type: String,
    },
    leaving_date: {
      type: String,
    },
    // AFFILIATE MARKETING PARAMETERS START
    aff_occupation: {
      type: String,
    },
    aff_state: {
      type: String,
    },
    aff_bank_name: {
      type: String,
    },
    aff_bank_ifsc: {
      type: String,
    },
    aff_bank_acc_no: {
      type: String,
    },
    aff_bank_branch: {
      type: String,
    },
    aff_bank_reg_mob: {
      type: String,
    },
    aff_upi_id: {
      type: String,
    },

    // AFFILIATE MARKETING PARAMETERS ENDS
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", userSchema);
