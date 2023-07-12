import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { uniqueCouponCode } from "../utils/uniqueCoupon.js";
import affiliateDashboard from "../models/affiliateDashboard.js";

// AFFILIATE REGISTRATION CONTROLLER
export const affiliateRegisterController = catchAsyncError(
  async (req, res, next) => {
    try {
      const {
        first_name,
        email,
        phone,
        password,
        dob,
        role,
        address,
        gender,
        profile,
        aff_occupation,
        aff_state,
        aff_bank_name,
        aff_bank_ifsc,
        aff_bank_acc_no,
        aff_bank_branch,
        aff_bank_reg_mob,
        aff_upi_id,
      } = req.body;

      if (
        (!first_name, !email, !phone, !password, !dob, !role, !address, !gender)
      ) {
        return next(
          new ErrorHandler("Please fill all required(*) fields.", 400, res)
        );
      } else if (password.length <= 7) {
        return next(
          new ErrorHandler(
            "Password must be minimum of 8 characters.",
            400,
            res
          )
        );
      }

      // Cheack user already registered or not
      const isUserExisted = await userModal.findOne({ email });
      if (isUserExisted) {
        res.status(200).send({
          success: true,
          message: "Account already existed with this email.",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await userModal.create({
          first_name,
          email,
          phone,
          password: hashPassword,
          dob,
          role,
          address,
          gender,
          profile,
          aff_occupation,
          aff_state,
          aff_bank_name,
          aff_bank_ifsc,
          aff_bank_acc_no,
          aff_bank_branch,
          aff_bank_reg_mob,
          aff_upi_id,
        });

        res.status(201).send({
          success: true,
          message: "Affiliate registered successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// AFFILIATE LOGIN CONTROLLER
export const affiliateLoginController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { email, password, device_code } = req.body;

      // IF EMAIL OR PASSWORD NOT ENTERED
      if (!email || (!password && !device_code)) {
        return next(
          new ErrorHandler("Please fill all the fields carefully", 404, res)
        );
      }

      // find user by email if available
      const user = await userModal.findOne({ email });

      // IF USER NOT FOUND
      if (!user) {
        return next(
          new ErrorHandler(
            "Affiliate not registered, Please register & try again.",
            404,
            res
          )
        );
      }

      // is Password Match or not
      if (password) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return next(
            new ErrorHandler("Invalid username or password.", 404, res)
          );
        }
      }

      // is Device Code match or not
      if (device_code) {
        const isDeviceCodeMatch = device_code == user.device_code;

        if (!isDeviceCodeMatch) {
          return next(
            new ErrorHandler("Invalid username or device code.", 404, res)
          );
        }
      }

      // GENERATE TOKEN
      const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
      });

      res.status(200).send({
        success: true,
        message: "Login Successfully",
        token,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// SETUP AFFILIATE DASHBOARD
export const setupAffiliateDashboardController = catchAsyncError(
  async (req, res, next) => {
    try {
      const isExist = await affiliateDashboard.findOne({
        for_affiliate: req.user._id,
      });

      if (isExist) {
        return next(
          new ErrorHandler("Your Dashboard already setuped!", 401, res)
        );
      }

      const dashboard = await affiliateDashboard.create({
        for_affiliate: req.user._id,
        deductedRevenue: 0,
        totalClicks: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        univesalLink: `https://alpharegiment.in/register/${uniqueCouponCode}`,
        couponCode: uniqueCouponCode,
      });

      res.status(201).send({
        success: true,
        message: "Dashboard Setup Successfully!",
        dashboard,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// GET AFFILIATE DASHBOARD DATA
export const getAffiliateDashboardController = catchAsyncError(
  async (req, res, next) => {
    try {
      const dashboardData = await affiliateDashboard.findOne({
        for_affiliate: req.user._id,
      });

      if (!dashboardData) {
        return next(
          new ErrorHandler("Your dashboard data not found!", 401, res)
        );
      }

      res.status(200).send({
        success: true,
        message: "Dashboard data get Successfully!",
        dashboardData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);
