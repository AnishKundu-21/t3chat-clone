"use client";

import * as React from "react";
import {useChats, ChatListItem} from "@/hooks/useChats";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {ShieldAlert} from "lucide-react";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function HistorySyncPage() {
    const {chats, isLoading} = useChats();
    const [selected, setSelected] = React.useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        setSelected(checked ? chats.map((c) => c.id) : []);
    };

    const handleSelect = (id: string, checked: boolean) => {
        setSelected((prev) =>
            checked ? [...prev, id] : prev.filter((sId) => sId !== id)
        );
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Message History</CardTitle>
                            <CardDescription>
                                Save your history as JSON, or import someone else's. Importing will NOT delete existing
                                messages.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" disabled={selected.length === 0}>
                                Export
                            </Button>
                            <Button variant="outline">Import</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 border-b pb-2 mb-2">
                        <Checkbox
                            id="select-all"
                            onCheckedChange={handleSelectAll}
                            checked={selected.length === chats.length && chats.length > 0}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium">
                            Select All
                        </label>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {isLoading && <p>Loading chat history...</p>}
                        {chats.map((chat: ChatListItem) => (
                            <div
                                key={chat.id}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                            >
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        id={chat.id}
                                        checked={selected.includes(chat.id)}
                                        onCheckedChange={(checked) => handleSelect(chat.id, !!checked)}
                                    />
                                    <label htmlFor={chat.id} className="font-medium">
                                        {chat.title || "New Chat"}
                                    </label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(chat.updatedAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="font-semibold">Restore old chats</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            If your chats from before June 1st are missing, click this to bring them back. Contact
                            support if you have issues.
                        </p>
                        <Button variant="secondary" className="mt-2">Restore old chats</Button>
                    </div>
                    <div className="flex items-start gap-4">
                        <div
                            className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <ShieldAlert className="h-5 w-5 text-destructive"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-destructive">
                                Permanently delete your history from both your local device and our servers.
                            </h2>
                            <Button variant="destructive" className="mt-4">
                                Delete Chat History
                            </Button>
                            <p className="mt-2 text-xs text-muted-foreground">
                                *The retention policies of our LLM hosting partners may vary.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}