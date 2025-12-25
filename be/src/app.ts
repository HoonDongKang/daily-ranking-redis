import express from "express";
import "dotenv/config";
import { connectRedis } from "./middlewares/redis";

export const app = express();
const port = process.env.PORT;

export const bootstrap = async () => {
    await connectRedis();

    app.use(express.json());
    // app.use("/api", apiRouter);
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
