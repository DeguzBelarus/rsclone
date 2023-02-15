import express from "express";

import { messageController } from '../controllers/message-controller'
import { roleAndIdAccessMiddleware } from '../middleware/role-id-access';

export const messageRouter = express.Router();
messageRouter.post("/send", roleAndIdAccessMiddleware, messageController.send);
messageRouter.get("/:userId/:interlocutorId", roleAndIdAccessMiddleware, messageController.getDialogMessages);
