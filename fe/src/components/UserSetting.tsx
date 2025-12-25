import { useState } from "react";
import { User as UserIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type User, updateUsername } from "@/lib/userStore";
import { toast } from "sonner";

interface UserSettingsProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

export default function UserSettings({ user, onUserUpdate }: UserSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);

    const handleSave = () => {
        const trimmed = newUsername.trim();
        if (!trimmed) {
            toast.error("닉네임을 입력해주세요");
            return;
        }
        if (trimmed.length < 2 || trimmed.length > 12) {
            toast.error("닉네임은 2-12자 사이여야 합니다");
            return;
        }
        if (trimmed !== user.username) {
            const updatedUser = updateUsername(trimmed);
            if (updatedUser) {
                onUserUpdate(updatedUser);
                toast.success("닉네임이 변경되었습니다");
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewUsername(user.username);
        setIsEditing(false);
    };

    return (
        <div className="space-y-4 py-4">
            <div>
                <label className="text-sm text-muted-foreground block mb-2">
                    <UserIcon className="h-4 w-4 inline mr-2" />
                    닉네임
                </label>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="bg-secondary border-border focus:border-primary"
                            maxLength={12}
                            autoFocus
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSave}
                            className="hover:bg-success/20"
                        >
                            <Check className="h-4 w-4 text-success" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancel}
                            className="hover:bg-destructive/20"
                        >
                            <X className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                        <span className="font-medium">{user.username}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-primary hover:bg-primary/10"
                        >
                            변경
                        </Button>
                    </div>
                )}
            </div>

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
