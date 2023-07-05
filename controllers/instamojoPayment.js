import Insta from "instamojo-nodejs";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import paymentRequestDone from "../models/paymentRequestDone.js";

// CREATE PAYMENT REQUEST
export const coursePaymentController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { amount, purpose } = req.body;
      const user = req.user;

      var paymenData = new Insta.PaymentData();

      const REDIRECT_URL = "http://localhost:3000/verification";

      paymenData.setRedirectUrl(REDIRECT_URL);
      paymenData.send_email = false;
      paymenData.purpose = `Enrollment fees of ${purpose}`;
      paymenData.amount = amount;
      paymenData.email = user.email;
      paymenData.phone = user.phone;
      paymenData.buyer_name =
        user?.first_name + " " + user?.middle_name + " " + user?.last_name;
      paymenData.webhook = "http://senapariwar.com/course-details";
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

// PAYMENT REQUEST DONE - AGAR PAYMENT SUCCESSFULL HO JAYE
export const paymentRequestDoneController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { payment_request_id, payment_status, payment_id, for_course } =
        req.body;
      const user = req.user;

      if (
        !payment_request_id ||
        !payment_status ||
        !payment_id ||
        !for_course
      ) {
        return next(
          new ErrorHandler(
            "Your payment data not found. If you paid, please contact with our support.",
            404,
            res
          )
        );
      }

      const isExisted = await paymentRequestDone.findOne({
        payment_request_id,
      });

      if (isExisted) {
        return next(new ErrorHandler("Payment Already Existed!", 404, res));
      }

      await paymentRequestDone.create({
        payment_request_id,
        payment_status,
        payment_id,
        for_course,
        payment_by: user._id,
      });

      res.status(201).send({
        success: true,
        message: "Payment Details Added.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500, res));
    }
  }
);

// GET PAYMENT DETAILS DONE BY USER - DATABASE DETAILS
export const getUserPaymentDetails = catchAsyncError(async (req, res, next) => {
  try {
    const user = req.user;

    const paymentDetails = await paymentRequestDone.find({
      payment_by: user._id,
    });

    if (paymentDetails.length === 0) {
      return next(new ErrorHandler("No payments done by you.", 404, res));
    }

    res.status(200).send({
      success: true,
      paymentDetails,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500, res));
  }
});

// CHECK PAYMENT STATUS
export const checkPaymentStatus = catchAsyncError(async (req, res, next) => {
  try {
    const { payment_req_id } = req.body;

    if (!payment_req_id) {
      return next(
        new ErrorHandler(
          "Please provide dedicated Payment Request Id for this transaction",
          404,
          res
        )
      );
    }

    Insta.getPaymentRequestStatus(payment_req_id, function (error, response) {
      if (error) {
        return next(new ErrorHandler(error.message, 404, res));
      } else {
        console.log(response);
        res.status(200).send(response);
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500, res));
  }
});
