import express from "express";

import { postController } from '../controllers/post-controller'
import { checkRoleMiddleware } from '../middleware/check-role';
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const postRouter = express.Router();
postRouter.post("/:id/creation", roleAndIdAccessMiddleware, postController.create);
