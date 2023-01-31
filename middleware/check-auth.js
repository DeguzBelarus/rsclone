const jwt = require("jsonwebtoken");

module.exports = function (request, response, next) {
  if (request.method === "OPTIONS") {
    next();
  }

  try {
    const token = request.headers.authorization.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return response.status(401).json({
          message: error.message
        });
      }
      request.user = decoded;
      next();
    });
  } catch (exception) {
    console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    response.status(401).json({
      message: exception.message
    });
  }
};
