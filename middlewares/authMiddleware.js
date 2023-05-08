import JWT from "jsonwebtoken";
import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandler.js";

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = JWT.verify(token, process.env.JWT_SECRET);
      var dateNow = new Date();
      if (decode.exp < dateNow.getTime() / 1000) {
        new ErrorHandler("Token/Session Expired, Please login again", 404, res);
      } else {
        req.user = await userModal.findById(decode.id).select("-password");
        next();
      }
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler("Not Authorized, Token Failed/Expired", 404, res)
      );
    }
  } else {
    return next(new ErrorHandler("Not Authorized, not token", 404, res));
  }
};

export default protect;
