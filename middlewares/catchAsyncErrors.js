export const catchAsyncError = (asyncErrosFunction) => (req, res, next) => {
    Promise.resolve(asyncErrosFunction(req, res, next)).catch(next);
  };
  