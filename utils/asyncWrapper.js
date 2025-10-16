const AppError = require("./appError");

module.exports = (asyncFn) => {
  return (req, res, next) => {
    Promise.resolve(asyncFn(req, res, next)).catch((error) =>
      next(new AppError(error.message, 500))
    );
  };
};
