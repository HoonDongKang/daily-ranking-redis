import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser, type User } from "@/lib/userStore";

interface NicknameEntryProps {
    onEnter: (user: User) => void;
}

export default function NicknameEntry({ onEnter }: NicknameEntryProps) {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = nickname.trim();
        if (!trimmed) {
            setError("닉네임을 입력해주세요");
            return;
        }
        if (trimmed.length < 2) {
            setError("닉네임은 2자 이상이어야 합니다");
            return;
        }
        if (trimmed.length > 12) {
            setError("닉네임은 12자 이하여야 합니다");
            return;
        }

        const user = await createUser(trimmed);

        if (!user) return;

        onEnter(user);
    };
    const TIME = import.meta.env.VITE_TIME;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card neon-border p-8 md:p-12 w-full max-w-md text-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-digital text-3xl md:text-4xl text-primary mb-2"
                >
                    타이머 챌린지
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground mb-8"
                >
                    당신의 시간 감각을 테스트하세요
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Input
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setError("");
                            }}
                            className="text-center text-lg h-14 bg-secondary/50 border-border/50 focus:border-primary"
                            autoFocus
                        />
                        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg font-digital"
                        >
                            시작하기
                        </Button>
                    </motion.div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-muted-foreground text-sm"
                >
                    <p>타이머를 보지 않고 정확히 {TIME}초에</p>
                    <p>Stop 버튼을 눌러보세요!</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
