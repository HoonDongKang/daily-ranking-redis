export const GAME_ERRORS = {
    BAD_REQUEST: {
        status: 400,
        code: "BAD_REQUEST",
        message: "잘못된 요청입니다.",
    },
    NICKNAME_DUPLICATE: {
        status: 409,
        code: "NICKNAME_DUPLICATE",
        message: "중복된 닉네임입니다",
    },
} as const;
