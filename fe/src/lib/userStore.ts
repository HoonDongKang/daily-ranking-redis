import { ApiError, apiRequest } from "./api";

export interface GameRecord {
    id: string;
    time: number;
    difference: number;
    timestamp: Date;
}

export interface User {
    nickname: string;
    records: [];
}

export interface GlobalRecord extends GameRecord {
    username: string;
}

const STORAGE_KEY = "timer-game-user";
const GLOBAL_RECORDS_KEY = "timer-game-global-records";

export async function createUser(nickname: string): Promise<User | undefined> {
    try {
        const response = await apiRequest<Partial<User>>("/api/users", {
            method: "POST",
            body: JSON.stringify({ nickname }),
        });

        const user: User = {
            nickname: response.nickname || "Unknown",
            records: [],
        };

        return user;
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

export function getGlobalRecords(): GlobalRecord[] {
    const data = localStorage.getItem(GLOBAL_RECORDS_KEY);
    if (!data) return [];
    return JSON.parse(data).map((r: GlobalRecord) => ({
        ...r,
        timestamp: new Date(r.timestamp),
    }));
}

export function getGlobalRanking(): GlobalRecord[] {
    const records = getGlobalRecords();
    return records.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
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
