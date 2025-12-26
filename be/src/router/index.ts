import express from "express";
import { userRouter } from "./user";
import { gameRouter } from "./game";

export const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/games", gameRouter);
