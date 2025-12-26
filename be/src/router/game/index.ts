import express from "express";
import dayjs from "../../utils/dayjs";
import { redisClient } from "../../middlewares/redis";
import { HttpError } from "../../errors/httpError";
import { DIFF_TYPES, Result, User } from "./types";
import { GAME_ERRORS } from "./consts";

export const gameRouter = express.Router();

const generateDailyRankingKey = (): string => {
    const today = dayjs().format("YYYY-MM-DD");
    return `ranking:${today}`;
};

const generateUserMember = (user: User) => {
    const { nickname, diff } = user;
    const type = diff >= 0 ? DIFF_TYPES.POSITIVE : DIFF_TYPES.NEGATIVE;
    const now = dayjs().valueOf();

    return `${nickname}:${type}:${now}`;
};
const parseValue = (value: string) => {
    const [nickname, type, timestamp] = value.split(":");
    return { nickname, type, timestamp };
};

const parseResults = (result: Result[]) => {
    return result.map(({ value, score }) => {
        const parsedValue = parseValue(value);
        const diff = parsedValue.type === DIFF_TYPES.POSITIVE ? score : -score;

        return { ...parsedValue, diff };
    });
};

gameRouter.get("/", async (req, res) => {
    try {
        const key = generateDailyRankingKey();
        const results = await redisClient.zRangeByScoreWithScores(key, 0, 9);
        const ranking = parseResults(results);

        res.status(200).send(ranking);
    } catch (error) {
        throw error;
    }
});

gameRouter.post("/", async (req, res) => {
    try {
        const { nickname, diff } = req.body;
        if (!nickname || typeof diff !== "number" || Number.isNaN(diff)) {
            throw new HttpError(GAME_ERRORS.BAD_REQUEST);
        }

        const key = generateDailyRankingKey();

        const score = Math.abs(diff);
        const member = generateUserMember({ nickname, diff });

        await redisClient.zAdd(key, { value: member, score });
        await redisClient.zRemRangeByRank(key, 10, -1);

        res.send({ member, score });
    } catch (error) {
        throw error;
    }
});
