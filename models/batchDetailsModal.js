import mongoose from "mongoose";

const courseDetailsSchema = new mongoose.Schema(
  {
    for_course: {
      type: mongoose.Schema.ObjectId,
      ref: "Courses",
      required: true,
    },
    contentEn1: {
      type: "String",
      required: true,
    },
    contentEn2: {
      type: "String",
      required: true,
    },
    contentEn3: {
      type: "String",
      required: true,
    },
    contentEn4: {
      type: "String",
      required: true,
    },
    contentHi1: {
      type: "String",
      required: true,
    },
    contentHi2: {
      type: "String",
      required: true,
    },
    contentHi3: {
      type: "String",
      required: true,
    },
    contentHi4: {
      type: "String",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CourseDetails", courseDetailsSchema);
