import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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
    course_id: {
      type: Number,
      required: true,
      maxLength: [3, "Course Id will be only three characters."],
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Courses", courseSchema);
