import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleAuth.js";
import {
  checkPaymentStatus,
  coursePaymentController,
  getUserPaymentDetails,
  paymentRequestDoneController,
} from "../controllers/instamojoPayment.js";

// Router Object
const router = express.Router();

// PAY ON INSTA MOJO ACCOUNT API - POST API
router.route("/course-payment").post(protect, coursePaymentController);

// STORE IMPORTANT DATA AFTER PAYMENT DONE - POST API
router
  .route("/payment-request-done")
  .post(protect, paymentRequestDoneController);

// STORE IMPORTANT DATA AFTER PAYMENT DONE - POST API
router.route("/get-payment-details").get(protect, getUserPaymentDetails);

// GET PAYMENT STATUS -- POST API
router.route("/payment-status").post(protect, checkPaymentStatus);

export default router;
