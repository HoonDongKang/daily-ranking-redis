import { Timer, Settings, LogOut } from "lucide-react";
import { type User, logout } from "@/lib/userStore";
import UserSettings from "./UserSetting";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderProps {
    user: User;
    onUserUpdate: (user: User) => void;
    onLogout: () => void;
}

export default function Header({ user, onUserUpdate, onLogout }: HeaderProps) {
    const handleLogout = () => {
        logout();
        onLogout();
    };

    const TIME = import.meta.env.VITE_TIME;

    return (
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <Timer className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-digital text-xl md:text-2xl text-primary">타이머 챌린지</h1>
                    <p className="text-xs text-muted-foreground">정확히 {TIME}초를 맞춰보세요!</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right mr-2">
                    <p className="text-sm text-muted-foreground">플레이어</p>
                    <p className="font-medium text-foreground">{user.username}</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-digital">설정</DialogTitle>
                        </DialogHeader>
                        <UserSettings user={user} onUserUpdate={onUserUpdate} />
                    </DialogContent>
                </Dialog>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
