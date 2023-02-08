import express from "express";

import { userController } from '../controllers/user-controller'
import { checkAuthMiddleware } from '../middleware/check-auth';
import { checkRoleMiddleware } from '../middleware/check-role';
import { roleAndIdAccessMiddleware } from '../middleware/role-id-acsess';

export const userRouter = express.Router();
userRouter.get("/authcheck", checkAuthMiddleware, userController.authCheck);
userRouter.get("/:userId", roleAndIdAccessMiddleware, userController.getOneUser);
userRouter.get("/", userController.getAll);
userRouter.post("/registration", userController.registration);
userRouter.post("/login", userController.login);
userRouter.put("/:id/update", roleAndIdAccessMiddleware, userController.update);
userRouter.delete("/:id/delete", roleAndIdAccessMiddleware, userController.delete);
