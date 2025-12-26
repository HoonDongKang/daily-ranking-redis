import express from "express";
import dayjs from "../../utils/dayjs";
import { USER_ERRORS } from "./ consts";
import { redisClient } from "../../middlewares/redis";
import { HttpError } from "../../errors/httpError";

export const userRouter = express.Router();

const generateDailyNicknameKey = (): string => {
    const today = dayjs().format("YYYY-MM-DD");
    return `nicknames:${today}`;
};

const getSecondsUntilTomorrow = (): number => {
    const now = dayjs();
    const midnight = now.add(1, "day").startOf("day");
    return midnight.diff(now, "second");
};

const setKeyExpiration = async (key: string): Promise<void> => {
    const ttl = await redisClient.ttl(key);

    if (ttl === -1) {
        const secondsUntilTomorrow = getSecondsUntilTomorrow();

        await redisClient.expire(key, secondsUntilTomorrow);
    }
};

userRouter.post("/", async (req, res) => {
    try {
        const { nickname } = req.body;

        if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
            throw new HttpError(USER_ERRORS.BAD_REQUEST);
        }

        const key = generateDailyNicknameKey();

        // 닉네임 중복 체크 및 추가
        const isAdded = await redisClient.sAdd(key, nickname.trim());

        if (isAdded === 0) {
            throw new HttpError(USER_ERRORS.NICKNAME_DUPLICATE);
        }

        // 해당 키 만료 설정
        await setKeyExpiration(key);

        res.status(201).send({
            success: true,
            user: nickname,
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
    }
});
