export interface GameRecord {
    id: string;
    time: number;
    difference: number;
    timestamp: Date;
}

export interface User {
    id: string;
    username: string;
    records: GameRecord[];
    bestRecord: number | null;
}

export interface GlobalRecord extends GameRecord {
    username: string;
}

const STORAGE_KEY = "timer-game-user";
const GLOBAL_RECORDS_KEY = "timer-game-global-records";

function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored);
    user.records = user.records.map((r: GameRecord) => ({
        ...r,
        timestamp: new Date(r.timestamp),
    }));
    return user;
}

export function createUser(nickname: string): User {
    const newUser: User = {
        id: generateUserId(),
        username: nickname,
        records: [],
        bestRecord: null,
    };

    saveUser(newUser);
    return newUser;
}

export function saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function updateUsername(newUsername: string): User | null {
    const user = getUser();
    if (!user) return null;
    user.username = newUsername;
    saveUser(user);
    return user;
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

    // Keep only last 50 records
    if (user.records.length > 50) {
        user.records = user.records.slice(0, 50);
    }

    saveUser(user);

    // Add to global records
    const globalRecord: GlobalRecord = { ...record, username: user.username };
    const globalRecords = getGlobalRecords();
    globalRecords.push(globalRecord);
    localStorage.setItem(GLOBAL_RECORDS_KEY, JSON.stringify(globalRecords));

    return { user, record };
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
