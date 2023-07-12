import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import affiliateDashboard from "../models/affiliateDashboard.js";

// USER REGISTRATION CONTROLLER
export const userRegisterController = catchAsyncError(
  async (req, res, next) => {
    try {
      const {
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        password,
        dob,
        address,
        gender,
        profile,
        fatherName,
        motherName,
        parentEmail,
        parentWhatsAppNo,
        referred_by,
      } = req.body;

      if (referred_by) {
        const isCouponCodeExist = await affiliateDashboard.findOne({
          couponCode: referred_by,
        });

        if (!isCouponCodeExist) {
          return next(new ErrorHandler("Coupon Code doesn't exist", 404, res));
        }
      }

      if (
        !first_name ||
        !email ||
        !phone ||
        !password ||
        !dob ||
        !address ||
        !gender
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
          message: "User already existed. Please Login.",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await userModal.create({
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          password: hashPassword,
          dob,
          address,
          gender,
          profile,
          fatherName,
          motherName,
          parentEmail,
          parentWhatsAppNo,
          referred_by,
        });

        res.status(201).send({
          success: true,
          message: "User registered successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error, 500, res));
    }
  }
);

// USER LOGIN CONTROLLER
export const userLoginController = catchAsyncError(async (req, res, next) => {
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
          "User not registered, Please register & try again.",
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
});

// GET LOGGED IN USER DETAILS
export const userProfile = catchAsyncError(async (req, res, next) => {
  const user = await userModal
    .findById(req.user.id)
    .select(["-password", "-device_code"]);

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404, res));
  }

  res.status(200).send({
    success: true,
    message: "Login Successfully",
    user,
  });
});

// LOG OUT USER
export const userLogout = catchAsyncError(async (req, res, next) => {
  const user = await userModal.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404, res));
  }

  localStorage.removeItem("alphaToken");

  res.status(200).send({
    success: true,
    message: "Logout Successfully",
    user,
  });
});

// UPDATE USER PROFILE
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dob,
    address: req.body.address,
    gender: req.body.gender,
    profile: req.body.profile,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    parentEmail: req.body.parentEmail,
    parentWhatsAppNo: req.body.parentWhatsAppNo,
  };

  await userModal.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully.",
  });
});

// Create/Update device code
export const deviceCodeGenerate = catchAsyncError(async (req, res, next) => {
  try {
    const { device_code } = req.body;
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("User not found!", 404, res));
    } else if (!device_code) {
      return next(new ErrorHandler("device code not found!", 404, res));
    } else if (device_code.length !== 6) {
      return next(
        new ErrorHandler("Device code must be only 6 characters.", 404, res)
      );
    }

    const updatedUser = await userModal.findByIdAndUpdate(
      req.user._id,
      { device_code },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).send({
      success: true,
      message: "Device code updated successfully.",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500, res));
  }
});

// UPLOAD PROFILE PICTURE
export const uploadProfilePic = catchAsyncError(async (req, res, next) => {
  if (req.body.profile !== "") {
    const user = req.user;
    var newUserData = {
      profile: {
        public_id: "",
        url: "",
      },
    };

    const result = await cloudinary.v2.uploader.upload(req.body.profile, {
      folder: "avatars",
      width: 200,
      height: 200,
      aspectRatio: 1.0,
      crop: "fill",
    });

    if (user.profile.public_id) {
      await cloudinary.v2.uploader.destroy(user.profile.public_id);
      if (result) {
        newUserData.profile = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        var updatedUser = await userModal.findByIdAndUpdate(
          user._id,
          newUserData,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      }
    } else {
      if (result) {
        newUserData.profile = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        var updatedUser = await userModal.findByIdAndUpdate(
          user._id,
          newUserData,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      }
    }
  } else {
    return next(new ErrorHandler("Please select a file", 404, res));
  }

  if (updatedUser)
    res.status(200).send({
      success: true,
      message: "Profile Pic Uploaded",
    });
});

// remove profile picture
export const removeProfilePic = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  var newUserData = {
    profile: {
      public_id: "",
      url: "",
    },
  };

  if (user.profile.public_id) {
    await cloudinary.v2.uploader.destroy(user.profile.public_id);

    var updatedUser = await userModal.findByIdAndUpdate(user._id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  } else {
    next(new ErrorHandler("Profile picture not found!", 404, res));
  }

  if (updatedUser)
    res.status(200).send({
      success: true,
      message: "Profile picture removed",
    });
});

// GET ALL USERS BY ROLE - ADMIN
export const getAllUsersByAdmin = catchAsyncError(async (req, res, next) => {
  try {
    const allAdmins = await userModal.find({ role: "10" });
    const allStudents = await userModal.find({ role: "11" });
    const allTeachers = await userModal.find({ role: "12" });
    const allReceptionists = await userModal.find({ role: "13" });
    const allStaffs = await userModal.find({ role: "14" });
    const allAffiliates = await userModal.find({ role: "15" });

    res.status(200).send({
      success: true,
      message: "All users found successfully!",
      allAdmins,
      allStudents,
      allTeachers,
      allReceptionists,
      allStaffs,
      allAffiliates,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500, res));
  }
});

// DELETE AFFILAITE BY ADMIN
export const deleteUserByAdminController = catchAsyncError(
  async (req, res, next) => {
    try {
      const affiliate = await userModal.findByIdAndDelete(req.params.id);

      if (!affiliate) {
        return next(new ErrorHandler("User not found with this ID!"));
      }

      res.status(200).send({
        success: true,
        message: "Affiliate Deleted Successfully!",
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// GET USER BY ID - ADMIN
export const getUserByIdAdminController = catchAsyncError(
  async (req, res, next) => {
    try {
      const userDetails = await userModal.findById(req.params.id);

      if (!userDetails) {
        return next(new ErrorHandler("User not found with this ID!"));
      }

      res.status(200).send({
        success: true,
        message: "User found successfully!",
        userDetails,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// GET USER BY ID - ADMIN
export const updateUserByIdAdminController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { first_name, email, phone, dob, gender, address } = req.body;
      const userDetails = await userModal.findById(req.params.id);

      if (!userDetails) {
        return next(new ErrorHandler("User not found with this ID!", 404, res));
      }

      if (!first_name || !email || !phone || !dob || !gender || !address) {
        return next(new ErrorHandler("Please fill all (*) fields!", 404, res));
      }

      await userModal.findByIdAndUpdate(
        req.params.id,
        {
          first_name,
          email,
          phone,
          dob,
          gender,
          address,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).send({
        success: true,
        message: "User Updated successfully!",
        userDetails,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);
