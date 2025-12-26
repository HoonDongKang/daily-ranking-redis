import express from "express";
import { userRouter } from "./user";

export const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
