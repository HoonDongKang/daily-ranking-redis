import { motion } from "framer-motion";
import { Clock, Trophy, TrendingUp } from "lucide-react";
import { type GameRecord, formatTime, getAccuracyLevel, type User } from "@/lib/userStore";

interface RecordHistoryProps {
    user: User;
}

const accuracyColors = {
    perfect: "text-success",
    excellent: "text-success",
    good: "text-warning",
    fair: "text-warning",
    poor: "text-destructive",
};

export default function RecordHistory({ user }: RecordHistoryProps) {
    const { records, bestRecord } = user;

    if (records.length === 0) {
        return (
            <div className="glass-card p-6 neon-border text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">아직 기록이 없습니다.</p>
                <p className="text-sm text-muted-foreground mt-1">게임을 시작해보세요!</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 neon-border">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    기록 히스토리
                </h2>
                {bestRecord !== null && (
                    <div className="flex items-center gap-2 text-success">
                        <Trophy className="h-4 w-4" />
                        <span className="font-digital text-sm">
                            최고: {formatTime(bestRecord)}초
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {records.slice(0, 20).map((record, index) => (
                    <RecordItem
                        key={record.id}
                        record={record}
                        rank={index + 1}
                        isBest={record.difference === bestRecord}
                    />
                ))}
            </div>
        </div>
    );
}

function RecordItem({
    record,
    rank,
    isBest,
}: {
    record: GameRecord;
    rank: number;
    isBest: boolean;
}) {
    const TIME = Number.parseInt(import.meta.env.VITE_TIME);
    const standardTime = TIME * 1000;

    const difference = record.time - standardTime;
    const level = getAccuracyLevel(difference);
    const colorClass = accuracyColors[level];
    const sign = difference >= 0 ? "+" : "-";

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
                isBest ? "bg-success/10 border border-success/30" : "bg-secondary/50"
            }`}
        >
            <div className="flex items-center gap-3">
                <span
                    className={`w-6 text-center font-digital text-sm ${
                        isBest ? "text-success" : "text-muted-foreground"
                    }`}
                >
                    {isBest ? "👑" : `#${rank}`}
                </span>
                <div>
                    <span className="font-digital text-foreground">
                        {formatTime(record.time)}초
                    </span>
                    <span className={`ml-2 text-sm ${colorClass}`}>
                        ({sign}
                        {formatTime(Math.abs(difference))})
                    </span>
                </div>
            </div>
            <span className="text-xs text-muted-foreground">
                {new Date(record.timestamp).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </motion.div>
    );
}
