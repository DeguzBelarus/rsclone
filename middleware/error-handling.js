const ApiError = require("../error-handler/error-handler");

module.exports = function (error, request, response, next) {
  if (error instanceof ApiError) {
    return response.status(error.status).json({
      message: error.message
    });
  }
  return response.status(500).json({
    message: "Unexpected Error"
  });
};
