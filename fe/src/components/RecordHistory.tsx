import { motion } from "framer-motion";
import { Clock, Trophy, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    type GameRecord,
    type GlobalRecord,
    type User,
    formatTime,
    getAccuracyLevel,
    getGlobalRanking,
} from "@/lib/userStore";

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

function getRankBadge(rank: number) {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center text-muted-foreground text-sm">{rank}</span>;
}

export default function RecordHistory({ user }: RecordHistoryProps) {
    const { records, bestRecord } = user;
    const globalRanking = getGlobalRanking();

    return (
        <div className="glass-card p-4 neon-border">
            <Tabs defaultValue="my-records" className="w-full">
                <TabsList className="w-full mb-4">
                    <TabsTrigger
                        value="my-records"
                        className="flex-1 font-digital text-xs sm:text-sm"
                    >
                        <Clock className="w-4 h-4 mr-1 sm:mr-2" />내 기록
                    </TabsTrigger>
                    <TabsTrigger value="ranking" className="flex-1 font-digital text-xs sm:text-sm">
                        <Trophy className="w-4 h-4 mr-1 sm:mr-2" />
                        전체 랭킹
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="my-records">
                    {/* Best Record */}
                    {bestRecord !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/30"
                        >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Trophy className="w-4 h-4 text-primary" />
                                최고 기록
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-digital text-lg text-primary">
                                    오차 {formatTime(Math.abs(bestRecord))}초
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Record List */}
                    <ScrollArea className="h-[300px]">
                        {records.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">아직 기록이 없습니다</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    게임을 시작해보세요!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {records.slice(0, 20).map((record, index) => (
                                    <RecordItem
                                        key={record.id}
                                        record={record}
                                        rank={index + 1}
                                        isBest={
                                            bestRecord !== null &&
                                            Math.abs(record.difference) === Math.abs(bestRecord)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="ranking">
                    <ScrollArea className="h-[350px]">
                        {globalRanking.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                아직 기록이 없습니다
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {globalRanking
                                    .slice(0, 50)
                                    .map((record: GlobalRecord, index: number) => (
                                        <motion.div
                                            key={record.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`flex justify-between items-center p-3 rounded-lg ${
                                                record.nickname === user.nickname
                                                    ? "bg-primary/20 border border-primary/30"
                                                    : "bg-secondary/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {getRankBadge(index + 1)}
                                                <div>
                                                    <span className="font-medium">
                                                        {record.nickname}
                                                    </span>
                                                    <span className="font-digital text-sm text-muted-foreground ml-2">
                                                        {formatTime(record.time)}초
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-sm ${
                                                    accuracyColors[
                                                        getAccuracyLevel(record.difference)
                                                    ]
                                                }`}
                                            >
                                                오차 {formatTime(Math.abs(record.difference))}
                                            </span>
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>
            </Tabs>
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
    const level = getAccuracyLevel(record.difference);
    const colorClass = accuracyColors[level];
    const difference = record.difference;
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
