import express from "express";

import { commentController } from '../controllers/comment-controller'
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const commentRouter = express.Router();
commentRouter.post("/:postId/:userId/creation", roleAndIdAccessMiddleware, commentController.create);
commentRouter.delete("/:id/delete", roleAndIdAccessMiddleware, commentController.delete);
commentRouter.put("/:id/update", roleAndIdAccessMiddleware, commentController.update);
