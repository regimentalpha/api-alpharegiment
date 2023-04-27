class ErrorHandler extends Error {
  constructor(message, statusCode, res) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
    res.status(statusCode).send({
      success: false,
      message: message,
    });
  }
}

export default ErrorHandler;
