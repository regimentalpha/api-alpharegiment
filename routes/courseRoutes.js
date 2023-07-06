import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleAuth.js";
import {
  createCourseController,
  getAllCourses,
  getCoursesById,
  updateCourseController,
  deleteCourseController,
  createBtachDetails,
  getCourseLongDetails,
} from "../controllers/courseControllers.js";

// Router Object
const router = express.Router();

// CREATE COURSE ROUTE - POST REQUEST
router
  .route("/create-course")
  .post(protect, authorizeRoles("10"), createCourseController);

// GET ALL COURSES - GET REQUEST
router.route("/courses").get(getAllCourses);

// GET COURSE BY ID - GET REQUEST
router
  .route("/course/:id")
  .get(getCoursesById)
  .put(protect, authorizeRoles("10"), updateCourseController)
  .delete(protect, authorizeRoles("10"), deleteCourseController);

// CREATE COURSE DETAILS - POST REQUEST
router
  .route("/create-course-details")
  .post(protect, authorizeRoles("10"), createBtachDetails);

// CREATE COURSE DETAILS - POST REQUEST
router.route("/get-course-long-details/:id").get(getCourseLongDetails);

export default router;
