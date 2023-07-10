import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleAuth.js";
import {
  affiliateLoginController,
  affiliateRegisterController,
  getAffiliateDashboardController,
  setupAffiliateDashboardController,
} from "../controllers/affiliateController.js";

// Router Object
const router = express.Router();

// REGISTER ROUTE - POST REQUEST
router
  .route("/affiliate-register")
  .post(protect, authorizeRoles("10"), affiliateRegisterController);

// LOGIN ROUTE - POST REQUEST
router.route("/affiliate-login").post(affiliateLoginController);

// SETUP AFFILIATE DASHBOARD ROUTE - POST REQUEST
router
  .route("/setup-affiliate-dashboard")
  .post(protect, authorizeRoles("15", "10"), setupAffiliateDashboardController);

// GET AFFILIATE DASHBOARD ROUTE - GET REQUEST
router
  .route("/affiliate-dashboard")
  .get(protect, authorizeRoles("15", "10"), getAffiliateDashboardController);

// CHECK AFFILIATE AUTH
router
  .route("/affiliate-auth")
  .get(protect, authorizeRoles("15"), async (req, res) => {
    res.status(200).send({ ok: true });
  });

export default router;
