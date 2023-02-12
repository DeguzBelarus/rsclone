import express from "express";

import { userRouter } from './user-router';
import { postRouter } from './post-router';
import { commentRouter } from './comment-router';

export const router = express.Router();
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
