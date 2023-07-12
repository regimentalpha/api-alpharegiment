import express from "express";
import {
  deviceCodeGenerate,
  removeProfilePic,
  updateProfile,
  uploadProfilePic,
  userLoginController,
  userProfile,
  userRegisterController,
  getAllUsersByAdmin,
  deleteUserByAdminController,
  getUserByIdAdminController,
  updateUserByIdAdminController,
} from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleAuth.js";

// Router Object
const router = express.Router();

// REGISTER ROUTE - POST REQUEST
router.route("/register").post(userRegisterController);

// LOGIN ROUTE - POST REQUEST
router.route("/login").post(userLoginController);

// PROFILE ROUTE - GET REQUEST
router.route("/profile").get(protect, userProfile);

// PROFILE UPDATE ROUTE - PUT REQUEST
router.route("/update-profile").put(protect, updateProfile);

// PROFILE UPDATE ROUTE - PUT REQUEST
router.route("/update-dcode").put(protect, deviceCodeGenerate);

// UPLOAD PROFILE PICTURE ===== POST REQUEST
router.route("/upload-profile-pic").post(protect, uploadProfilePic);

// UPLOAD PROFILE PICTURE ===== POST REQUEST
router.route("/remove-profile-pic").delete(protect, removeProfilePic);

// DELETE USER BY ADMIN ===== DELETE REQUEST BY ADMIN
router
  .route("/delete-user/:id")
  .delete(protect, authorizeRoles("10"), deleteUserByAdminController);

// GET USERS BY ADMIN ===== GET REQUEST
router
  .route("/get-all-users")
  .get(protect, authorizeRoles("10"), getAllUsersByAdmin);

// GET USERS BY ID ADMIN ===== GET REQUEST
router
  .route("/get-user-details/:id")
  .get(protect, authorizeRoles("10"), getUserByIdAdminController);

// UPDATE USERS BY ID ADMIN ===== PUT REQUEST
router
  .route("/update-user-details/:id")
  .put(protect, authorizeRoles("10"), updateUserByIdAdminController);

// PROTECTED USER ROUTE AUTH
router.route("/user-auth").get(protect, async (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
