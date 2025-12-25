import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    formatTime,
    addRecord,
    getAccuracyLevel,
    formatDifference,
    type GameRecord,
} from "@/lib/userStore";
import ResultDisplay from "./ResultDisplay";

interface TimerProps {
    onRecordAdded: () => void;
}

export default function Timer({ onRecordAdded }: TimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [displayTime, setDisplayTime] = useState(0);
    const [lastRecord, setLastRecord] = useState<GameRecord | null>(null);
    const [showResult, setShowResult] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const updateTimer = useCallback(() => {
        if (startTimeRef.current !== null) {
            const elapsed = Date.now() - startTimeRef.current;
            setDisplayTime(elapsed);
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        }
    }, []);

    const startTimer = useCallback(() => {
        setShowResult(false);
        setLastRecord(null);
        startTimeRef.current = Date.now();
        setIsRunning(true);
        setDisplayTime(0);
        animationFrameRef.current = requestAnimationFrame(updateTimer);
    }, [updateTimer]);

    const stopTimer = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (startTimeRef.current !== null) {
            const finalTime = Date.now() - startTimeRef.current;
            setDisplayTime(finalTime);

            const { record } = addRecord(finalTime);
            setLastRecord(record);
            setShowResult(true);
            onRecordAdded();
        }

        setIsRunning(false);
        startTimeRef.current = null;
    }, [onRecordAdded]);

    const resetTimer = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsRunning(false);
        setDisplayTime(0);
        setShowResult(false);
        setLastRecord(null);
        startTimeRef.current = null;
    }, []);

    const accuracyLevel = lastRecord ? getAccuracyLevel(lastRecord.difference) : null;

    const getTimerColorClass = () => {
        if (!showResult || !accuracyLevel) return "text-primary";
        switch (accuracyLevel) {
            case "perfect":
            case "excellent":
                return "text-success timer-display-success";
            case "good":
                return "text-warning timer-display-warning";
            default:
                return "text-destructive timer-display-error";
        }
    };

    const TIME = import.meta.env.VITE_TIME;

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Target indicator */}
            <div className="glass-card px-6 py-3 neon-border">
                <span className="text-muted-foreground text-sm">목표 시간</span>
                <span className="font-digital text-2xl text-primary ml-3">{TIME}</span>
                <span className="text-muted-foreground text-sm ml-1">초</span>
            </div>

            {/* Main timer display */}
            <motion.div
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div
                    className={`timer-display ${getTimerColorClass()} ${
                        isRunning ? "animate-pulse-glow" : ""
                    }`}
                >
                    {formatTime(displayTime)}
                </div>
            </motion.div>

            {/* Result display */}
            <AnimatePresence>
                {showResult && lastRecord && <ResultDisplay record={lastRecord} />}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-4">
                {!isRunning ? (
                    <Button
                        size="lg"
                        onClick={startTimer}
                        className="w-32 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50"
                    >
                        <Play className="mr-2 h-5 w-5" />
                        시작
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={stopTimer}
                        className="w-32 h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/30 transition-all hover:shadow-destructive/50"
                    >
                        <Square className="mr-2 h-5 w-5" />
                        정지
                    </Button>
                )}

                {(displayTime > 0 || showResult) && !isRunning && (
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={resetTimer}
                        className="w-32 h-14 text-lg font-semibold border-muted-foreground/30 hover:bg-secondary"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        리셋
                    </Button>
                )}
            </div>

            {/* Instructions */}
            {!isRunning && !showResult && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground text-center max-w-md"
                >
                    시작 버튼을 누르고, 정확히{" "}
                    <span className="text-primary font-semibold">{TIME}초</span>가 되었을 때 정지
                    버튼을 누르세요!
                </motion.p>
            )}
        </div>
    );
}
