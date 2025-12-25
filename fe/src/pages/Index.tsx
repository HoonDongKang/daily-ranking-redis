import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Timer from "@/components/Timer";
import RecordHistory from "@/components/RecordHistory";
import { type User, getUser } from "@/lib/userStore";

export default function Index() {
    const [user, setUser] = useState<User | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const handleRecordAdded = () => {
        setUser(getUser());
        setRefreshKey((prev) => prev + 1);
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="font-digital text-primary animate-pulse">로딩중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={user} onUserUpdate={handleUserUpdate} />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
                    {/* Timer Section */}
                    <div className="flex flex-col items-center justify-center min-h-[500px] glass-card p-8 neon-border">
                        <Timer onRecordAdded={handleRecordAdded} />
                    </div>

                    {/* Records Section */}
                    <div className="lg:sticky lg:top-8">
                        <RecordHistory key={refreshKey} user={user} />
                    </div>
                </div>
            </main>

            <footer className="py-4 text-center text-muted-foreground text-sm">
                <p>크리스마스 챌린지 - 당신의 시간 감각을 테스트하세요!</p>
            </footer>
        </div>
    );
}
