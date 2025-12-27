import dayjs from "dayjs";
import { ApiError, apiRequest } from "./api";
export interface GameRecord {
    id: string;
    time: number;
    difference: number;
    timestamp: Date;
}

export interface User {
    id: string;
    nickname: string;
    records: GameRecord[];
    bestRecord: number | null;
    createdAt: number;
}

export interface GlobalRecord extends GameRecord {
    nickname: string;
}

const STORAGE_KEY = "timer-game-user";

function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isUserExpired(createdAt: number): boolean {
    const expireAt = dayjs(createdAt).add(1, "day").startOf("day");

    return dayjs().isAfter(expireAt);
}

export function getUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored);
    if (isUserExpired(user.creatdAt)) {
        logout();
        return null;
    }
    user.records = user.records.map((r: GameRecord) => ({
        ...r,
        timestamp: new Date(r.timestamp),
    }));
    return user;
}

export async function createUser(nickname: string): Promise<User | undefined> {
    try {
        const response = await apiRequest<{ success: boolean; user: string }>("/api/users", {
            method: "POST",
            body: JSON.stringify({ nickname }),
        });

        const newUser: User = {
            id: generateUserId(),
            nickname: response.user || "Unknown",
            records: [],
            bestRecord: null,
            createdAt: Date.now(),
        };

        saveUser(newUser);
        return newUser;
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.code === "NICKNAME_DUPLICATE") {
                alert("닉네임이 중복되었어요 😢");
                return;
            }

            alert(error.message);
            return;
        }

        alert("알 수 없는 오류가 발생했어요");
        throw error;
    }
}

export function saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function addRecord(time: number): { user: User; record: GameRecord } {
    const user = getUser();
    if (!user) throw new Error("User not found");

    const TIME = import.meta.env.VITE_TIME;
    const standardTime = TIME * 1000;

    const difference = time - standardTime;

    const record: GameRecord = {
        id: `record_${Date.now()}`,
        time,
        difference,
        timestamp: new Date(),
    };

    user.records.unshift(record);

    const absDiff = Math.abs(difference);
    if (user.bestRecord === null || absDiff < Math.abs(user.bestRecord)) {
        user.bestRecord = difference;
    }

    if (user.records.length > 50) {
        user.records = user.records.slice(0, 50);
    }

    saveUser(user);

    // // Add to global records
    // const globalRecord: GlobalRecord = { ...record, nickname: user.nickname };
    // const globalRecords = getGlobalRecords();
    // globalRecords.push(globalRecord);
    // localStorage.setItem(GLOBAL_RECORDS_KEY, JSON.stringify(globalRecords));

    return { user, record };
}

export function getGlobalRecords(): GlobalRecord[] {
    return [];
    // const data = localStorage.getItem(GLOBAL_RECORDS_KEY);
    // if (!data) return [];
    // return JSON.parse(data).map((r: GlobalRecord) => ({
    //     ...r,
    //     timestamp: new Date(r.timestamp),
    // }));
}

export function getGlobalRanking(): GlobalRecord[] {
    return [];
    // const records = getGlobalRecords();
    // return records.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
}

export function logout(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

export function formatDifference(diff: number): string {
    const sign = diff >= 0 ? "+" : "-";
    return `${sign}${formatTime(Math.abs(diff))}`;
}

export function getAccuracyLevel(
    difference: number
): "perfect" | "excellent" | "good" | "fair" | "poor" {
    const absDiff = Math.abs(difference);
    if (absDiff <= 50) return "perfect";
    if (absDiff <= 200) return "excellent";
    if (absDiff <= 500) return "good";
    if (absDiff <= 1000) return "fair";
    return "poor";
}
