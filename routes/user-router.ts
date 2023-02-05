import express from "express";

import { userController } from '../controllers/user-controller'
import { checkAuthMiddleware } from '../middleware/check-auth';
import { checkRoleMiddleware } from '../middleware/check-role';

export const userRouter = express.Router();
userRouter.get("/authcheck", checkAuthMiddleware, userController.authCheck);
userRouter.get("/:id", userController.getOneUser);
userRouter.post("/registration", userController.registration);
userRouter.post("/login", userController.login);
userRouter.put("/:id/update", userController.update);
userRouter.delete("/:id/delete", checkRoleMiddleware("ADMIN"), userController.delete);
