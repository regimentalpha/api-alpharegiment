import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import courseModel from "../models/courseModel.js";

// CREATE COURSE
export const createCourseController = catchAsyncError(
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        original_price,
        discounted_price,
        study_mode,
        affiliate_percentage,
        thumbnail,
        starting_date,
        titleHindi,
        descriptionHindi,
        goalType,
        courseCategory,
        bannervideoLink,
      } = req.body;

      if (
        (!title,
        !description,
        !original_price,
        !discounted_price,
        !study_mode,
        !thumbnail,
        !starting_date,
        !titleHindi,
        !descriptionHindi,
        !bannervideoLink)
      ) {
        return next(
          new ErrorHandler("Please fill all required(*) fields.", 400, res)
        );
      } else {
        // upload thubnail on cloudinary
        const result = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
          folder: "course_thumb",
        });

        let course = {}; // COURSE VARIABLE
        if (result) {
          course = await courseModel.create({
            title,
            description,
            original_price,
            discounted_price,
            study_mode,
            affiliate_percentage,
            thumbnail: {
              public_id: result.public_id,
              url: result.secure_url,
            },
            created_by: req.user._id,
            starting_date,
            titleHindi,
            descriptionHindi,
            goalType,
            courseCategory,
            bannervideoLink,
          });
        }

        res.status(201).send({
          success: true,
          message: "course created successfully",
          course,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// GET ALL COURSES
export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await courseModel.find();

  if (!courses) {
    return next(new ErrorHandler("Courses not found", 404, res));
  }

  res.status(200).send({
    success: true,
    message: "All courses found successfully",
    numberOfCourses: courses.length,
    courses,
  });
});

// GET COURSE BY ID
export const getCoursesById = catchAsyncError(async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404, res));
    }

    res.status(200).send({
      success: true,
      message: "Course get successfully",
      course,
    });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler(error.message, 400, res));
  }
});

// DELETE COURSE BY ID
export const deleteCourseController = catchAsyncError(
  async (req, res, next) => {
    try {
      const course = await courseModel.findById(req.params.id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404, res));
      }

      if (course.thumbnail.public_id) {
        await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
      }

      await course.deleteOne();

      res.status(200).send({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// UPDATE COURSE
export const updateCourseController = catchAsyncError(
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        original_price,
        discounted_price,
        study_mode,
        affiliate_percentage,
        thumbnail,
        starting_date,
        titleHindi,
        descriptionHindi,
        goalType,
        courseCategory,
        bannervideoLink,
      } = req.body;

      const course = await courseModel.findById(req.params.id);

      if (!course) {
        // IF COURSE NOT FOUND
        return next(new ErrorHandler("Course not found", 404, res));
      }

      if (thumbnail) {
        // delete existing thumbnail
        await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        // upload thubnail on cloudinary
        const cloudinaryResult = await cloudinary.v2.uploader.upload(
          thumbnail,
          {
            folder: "course_thumb",
          }
        );

        if (cloudinaryResult) {
          var updatedCourse = await courseModel.findByIdAndUpdate(
            course._id,
            {
              title,
              description,
              original_price,
              discounted_price,
              study_mode,
              affiliate_percentage,
              starting_date,
              titleHindi,
              descriptionHindi,
              goalType,
              courseCategory,
              bannervideoLink,
              updated_by: req.user._id,
              thumbnail: {
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
              },
            },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
        }
      } else {
        var updatedCourse = await courseModel.findByIdAndUpdate(
          course._id,
          {
            title,
            description,
            original_price,
            discounted_price,
            study_mode,
            affiliate_percentage,
            starting_date,
            titleHindi,
            descriptionHindi,
            goalType,
            courseCategory,
            bannervideoLink,
            updated_by: req.user._id,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      }

      res.status(201).send({
        success: true,
        message: "course updated successfully",
        updatedCourse,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 400, res));
    }
  }
);
