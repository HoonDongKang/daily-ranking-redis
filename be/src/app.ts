import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectRedis } from "./middlewares/redis";
import { apiRouter } from "./router";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();
const port = process.env.PORT;
const FE_ORIGIN = process.env.FE_ORIGIN;

export const bootstrap = async () => {
    await connectRedis();

    app.use(cors({ origin: FE_ORIGIN }));
    app.use(express.json());
    app.use("/api", apiRouter);

    app.use(errorHandler);
};

(async () => {
    try {
        await bootstrap();
        app.listen(3000, () => {
            console.log(`Server is Listening on ${port}`);
        });
    } catch (e) {
        console.error("Server failed to start", e);
        process.exit(1);
    }
})();
