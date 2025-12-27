import { motion } from "framer-motion";
import { type GameRecord, getAccuracyLevel, formatTime } from "@/lib/userStore";
import { Trophy, Target, Zap, ThumbsUp, AlertTriangle } from "lucide-react";

interface ResultDisplayProps {
    record: GameRecord;
}

const accuracyConfig = {
    perfect: {
        label: "완벽!",
        description: "놀라운 정확도입니다!",
        icon: Trophy,
        colorClass: "text-success",
        bgClass: "bg-success/10 border-success/30",
    },
    excellent: {
        label: "훌륭함!",
        description: "거의 완벽에 가깝습니다!",
        icon: Zap,
        colorClass: "text-success",
        bgClass: "bg-success/10 border-success/30",
    },
    good: {
        label: "좋음",
        description: "좋은 결과입니다!",
        icon: ThumbsUp,
        colorClass: "text-warning",
        bgClass: "bg-warning/10 border-warning/30",
    },
    fair: {
        label: "보통",
        description: "조금 더 연습해보세요.",
        icon: Target,
        colorClass: "text-warning",
        bgClass: "bg-warning/10 border-warning/30",
    },
    poor: {
        label: "아쉬움",
        description: "다시 도전해보세요!",
        icon: AlertTriangle,
        colorClass: "text-destructive",
        bgClass: "bg-destructive/10 border-destructive/30",
    },
};

export default function ResultDisplay({ record }: ResultDisplayProps) {
    const level = getAccuracyLevel(record.diff);
    const config = accuracyConfig[level];
    const Icon = config.icon;
    const time = import.meta.env.VITE_TIME;
    const baseTimeMs = Number(time) * 1000;

    const difference = record.diff;
    const sign = difference >= 0 ? "+" : "-";
    const userTime = baseTimeMs + difference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`glass-card p-6 border ${config.bgClass} min-w-[300px]`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${config.bgClass}`}>
                    <Icon className={`h-6 w-6 ${config.colorClass}`} />
                </div>
                <div>
                    <h3 className={`font-bold text-xl ${config.colorClass}`}>{config.label}</h3>
                    <p className="text-muted-foreground text-sm">{config.description}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">기록 시간</span>
                    <span className="font-digital text-xl text-foreground">
                        {formatTime(userTime)}초
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">차이</span>
                    <span className={`font-digital text-xl ${config.colorClass}`}>
                        {sign}
                        {formatTime(Math.abs(difference))}초
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
