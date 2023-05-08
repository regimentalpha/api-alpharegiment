import express from "express";
import {
  deleteUser,
  updateProfile,
  userLoginController,
  userProfile,
  userRegisterController,
} from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
import userModal from "../models/userModal.js";
import authorizeRoles from "../middlewares/roleAuth.js";

// Router Object
const router = express.Router();

// TESTING API FOR TEST ===== GET API
router.route("/testing").get(async (req, res) => {
  res.status(200).send({ success: true, message: "Api Working Fine" });
});

// REGISTER ROUTE - POST REQUEST
router.route("/register").post(userRegisterController);

// LOGIN ROUTE - POST REQUEST
router.route("/login").post(userLoginController);

// PROFILE ROUTE - GET REQUEST
router.route("/profile").get(protect, userProfile);

// PROFILE UPDATE ROUTE - PUT REQUEST
router.route("/update-profile").put(protect, updateProfile);

// =============== ADMIN ROUTES ================

// DELETE USER ROUTE - DELETE REQUEST ================ ADMIN ROUTE
router.route("/delete-user").delete(protect, authorizeRoles(10), deleteUser);

// PROTECTED USER ROUTE AUTH
router.route("/user-auth").get(protect, async (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
