import mongoose from "mongoose";

const courseMetaSchema = new mongoose.Schema(
  {
    for_course: {
      type: mongoose.Schema.ObjectId,
      ref: "Courses",
      required: true,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaAuthor: {
      type: String,
      required: true,
    },
    metaTitleHindi: {
      type: String,
      required: true,
    },
    metaKeywordsHindi: {
      type: String,
      required: true,
    },
    metaDescriptionHindi: {
      type: String,
      required: true,
    },
    metaAuthorHindi: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CoursesMeta", courseMetaSchema);
