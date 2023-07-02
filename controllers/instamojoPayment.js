import Insta from "instamojo-nodejs";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const coursePaymentController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { amount, purpose } = req.body;
      const user = req.user;

      var paymenData = new Insta.PaymentData();

      const REDIRECT_URL = "https://alpharegiment.in/verification";

      paymenData.setRedirectUrl(REDIRECT_URL);
      paymenData.send_email = false;
      paymenData.purpose = purpose;
      paymenData.amount = amount;
      paymenData.email = user.email;
      paymenData.phone = user.phone;
      paymenData.buyer_name =
        user?.first_name + " " + user?.middle_name + " " + user?.last_name;
      paymenData.webhook = "https://alpharegiment.in/verification";
      paymenData.send_sms = false;
      paymenData.allow_repeated_payments = false;

      Insta.createPayment(paymenData, (error, response) => {
        if (error) {
          console.log(error);
          return next(new ErrorHandler(error.message, 404, res));
        } else {
          const resData = JSON.parse(response);
          res.status(200).send(resData);
        }
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// Private API Key 67aa2bc03dc5fb376df51da35a5a9527
// Private Auth Token 63e9cbf5b18f681769a76557482d1143
// Private Salt fa8e4b939a164a7798810c48c0c802ad
