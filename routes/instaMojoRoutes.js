import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleAuth.js";
import { coursePaymentController } from "../controllers/instamojoPayment.js";

// Router Object
const router = express.Router();

// PAY ON INSTA MOJO ACCOUNT API
router.route("/course-payment").post(protect, coursePaymentController);

export default router;
