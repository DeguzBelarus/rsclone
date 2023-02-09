import express from "express";

import { userRouter } from './user-router';
import { postRouter } from './post-router';

export const router = express.Router();
router.use("/user", userRouter);
router.use("/post", postRouter);
