import express from "express";

import { postController } from '../controllers/post-controller'
import { checkRoleMiddleware } from '../middleware/check-role';
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const postRouter = express.Router();
postRouter.get("/:id", postController.getOnePost);
postRouter.get("/", postController.getAllPosts);
postRouter.post("/:id/creation", roleAndIdAccessMiddleware, postController.create);
postRouter.put("/:id/update", roleAndIdAccessMiddleware, postController.update);
postRouter.delete("/:id/delete", roleAndIdAccessMiddleware, postController.delete);
