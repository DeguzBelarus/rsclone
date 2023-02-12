import express from "express";

import { commentController } from '../controllers/comment-controller'
import { checkRoleMiddleware } from '../middleware/check-role';
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const commentRouter = express.Router();
commentRouter.post("/:postId/:userId/creation", roleAndIdAccessMiddleware, commentController.create);
// commentRouter.delete("/:id/delete", roleAndIdAccessMiddleware, commentController.delete);
