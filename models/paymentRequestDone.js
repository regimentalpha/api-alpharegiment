import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_request_id: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
      required: true,
    },
    payment_date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    for_course: {
      type: String,
      required: true,
    },
    payment_by: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
