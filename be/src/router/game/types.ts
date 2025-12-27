export type Record = {
    nickname: string;
    type: diffTypes;
    diff: number;
    timestamp: Date;
};

export type Result = {
    value: string;
    score: number;
};

export const DIFF_TYPES = {
    POSITIVE: "POSITIVE",
    NEGATIVE: "NEGATIVE",
} as const;

export type diffTypes = (typeof DIFF_TYPES)[keyof typeof DIFF_TYPES];
