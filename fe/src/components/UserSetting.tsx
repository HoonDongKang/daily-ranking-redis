import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User as UserIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type User, updateUsername } from "@/lib/userStore";

interface UserSettingsProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

export default function UserSettings({ user, onUserUpdate }: UserSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);

    const handleSave = () => {
        if (newUsername.trim() && newUsername !== user.username) {
            const updatedUser = updateUsername(newUsername.trim());
            onUserUpdate(updatedUser);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewUsername(user.username);
        setIsEditing(false);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-secondary"
            >
                <Settings className="h-5 w-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 z-50 glass-card p-4 neon-border min-w-[280px]"
                        >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-primary" />
                                사용자 설정
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-2">
                                        사용자명
                                    </label>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Input
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value)}
                                                className="bg-secondary border-border focus:border-primary"
                                                maxLength={20}
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

                                <div>
                                    <label className="text-sm text-muted-foreground block mb-2">
                                        사용자 ID
                                    </label>
                                    <div className="p-2 bg-secondary/50 rounded-lg">
                                        <span className="font-mono text-xs text-muted-foreground break-all">
                                            {user.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">총 게임 수</span>
                                        <span className="font-digital text-primary">
                                            {user.records.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
