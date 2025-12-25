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

const STORAGE_KEY = "timer-game-user";

const adjectives = [
    "빠른",
    "정확한",
    "날카로운",
    "차분한",
    "신속한",
    "집중하는",
    "끈기있는",
    "도전적인",
];
const nouns = ["사자", "독수리", "호랑이", "용", "늑대", "매", "표범", "곰"];

function generateRandomUsername(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
}

function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getUser(): User {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const user = JSON.parse(stored);
        user.records = user.records.map((r: GameRecord) => ({
            ...r,
            timestamp: new Date(r.timestamp),
        }));
        return user;
    }

    const newUser: User = {
        id: generateUserId(),
        username: generateRandomUsername(),
        records: [],
        bestRecord: null,
    };

    saveUser(newUser);
    return newUser;
}

export function saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function updateUsername(newUsername: string): User {
    const user = getUser();
    user.username = newUsername;
    saveUser(user);
    return user;
}

export function addRecord(time: number): { user: User; record: GameRecord } {
    const user = getUser();
    const TIME = Number.parseInt(import.meta.env.VITE_TIME);
    const standardTime = TIME * 1000;
    const difference = Math.abs(time - standardTime);

    const record: GameRecord = {
        id: `record_${Date.now()}`,
        time,
        difference,
        timestamp: new Date(),
    };

    user.records.unshift(record);

    if (user.bestRecord === null || difference < user.bestRecord) {
        user.bestRecord = difference;
    }

    // Keep only last 50 records
    if (user.records.length > 50) {
        user.records = user.records.slice(0, 50);
    }

    saveUser(user);
    return { user, record };
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
    const diff = Math.abs(difference);
    if (diff <= 50) return "perfect";
    if (diff <= 200) return "excellent";
    if (diff <= 500) return "good";
    if (diff <= 1000) return "fair";
    return "poor";
}
