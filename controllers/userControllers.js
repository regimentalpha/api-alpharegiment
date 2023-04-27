import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

// USER REGISTRATION CONTROLLER
export const userRegisterController = async (req, res, next) => {
  try {
    const { fullName, email, whatsAppNo, password } = req.body;

    if (!fullName) {
      return next(new ErrorHandler("Please enter full name", 400, res));
    } else if (!email) {
      return next(new ErrorHandler("Please enter email", 400, res));
    } else if (!whatsAppNo) {
      return next(new ErrorHandler("Please enter whatsapp number.", 400, res));
    } else if (!password) {
      return next(new ErrorHandler("Please enter password", 400, res));
    } else if (password.length <= 7) {
      return next(
        new ErrorHandler("Password must be minimum of 8 characters.", 400, res)
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
        fullName,
        email,
        whatsAppNo,
        password: hashPassword,
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
};

// USER LOGIN CONTROLLER
export const userLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // IF EMAIL OR PASSWORD NOT ENTERED
    if (!email || !password) {
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
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid username or password.", 404, res));
    }

    // GENERATE TOKEN
    const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 500, res));
  }
};

// GET LOGGED IN USER DETAILS
export const userProfile = async (req, res, next) => {
  const user = await userModal.findById(req.user?.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404, res));
  }

  res.status(200).send({
    success: true,
    message: "Login Successfully",
    user,
  });
};

// LOG OUT USER
export const userLogout = async (req, res, next) => {
  const user = await userModal.findById(req.user?.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404, res));
  }

  localStorage.removeItem("alphaToken");

  res.status(200).send({
    success: true,
    message: "Logout Successfully",
    user,
  });
};
