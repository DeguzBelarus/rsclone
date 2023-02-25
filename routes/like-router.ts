import express from 'express';

import { likeController } from '../controllers/like-controller';
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const likeRouter = express.Router();
likeRouter.post('/:postId/:userId/creation', roleAndIdAccessMiddleware, likeController.create);
likeRouter.delete('/:id/delete', roleAndIdAccessMiddleware, likeController.delete);
