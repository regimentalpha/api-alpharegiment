import mongoose from "mongoose";

const affiliateDashboardSchema = new mongoose.Schema(
  {
    for_affiliate: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    totalRevenue: {
      type: Number,
      required: true,
    },
    deductedRevenue: {
      type: Number,
      required: true,
    },
    totalClicks: {
      type: Number,
      required: true,
    },
    totalEnrollments: {
      type: Number,
      required: true,
    },
    univesalLink: {
      type: String,
      required: true,
      unique: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AffiliateDashboard", affiliateDashboardSchema);
