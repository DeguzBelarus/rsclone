const Router = require("express");

const router = new Router();
const userController = require("../controllers/user-controller");
const checkAuthMiddleware = require("../middleware/check-auth");
const checkRoleMiddleware = require("../middleware/check-role");

router.get("/authcheck", checkAuthMiddleware, userController.authCheck);
router.post("/registration", userController.registration);
router.post("/login", userController.login);

module.exports = router;
