import { Timer } from "lucide-react";
import { type User } from "@/lib/userStore";
import UserSettings from "./UserSetting";

interface HeaderProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

const TIME = import.meta.env.VITE_TIME;

export default function Header({ user, onUserUpdate }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <Timer className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-digital text-xl md:text-2xl text-primary">
                        크리스마스 챌린지
                    </h1>
                    <p className="text-xs text-muted-foreground">정확히 {TIME}초를 맞춰보세요!</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                    <p className="text-sm text-muted-foreground">플레이어</p>
                    <p className="font-medium text-foreground">{user.username}</p>
                </div>
                <UserSettings user={user} onUserUpdate={onUserUpdate} />
            </div>
        </header>
    );
}
