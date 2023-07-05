import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleHindi: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionHindi: {
      type: String,
      required: true,
    },
    original_price: {
      type: Number,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    study_mode: {
      type: String,
      required: true,
    },
    affiliate_percentage: {
      type: String,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    starting_date: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    goalType: {
      type: String,
      required: true,
    },
    courseCategory: {
      type: String,
      required: true,
    },
    bannervideoLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Courses", courseSchema);
