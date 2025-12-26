import { type User } from "@/lib/userStore";

interface UserSettingsProps {
    user: User;
}

export default function UserSettings({ user }: UserSettingsProps) {
    return (
        <div className="space-y-4 py-4">
            <div className="pt-2 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">총 게임 수</span>
                    <span className="font-digital text-primary">{user.records.length}회</span>
                </div>
                {user.bestRecord !== null && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">최고 기록 오차</span>
                        <span className="font-digital text-success">
                            {Math.abs(user.bestRecord)}ms
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
