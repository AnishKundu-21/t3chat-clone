"use client";

import * as React from "react";
import {useSession} from "next-auth/react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Kbd} from "@/components/ui/kbd";

export default function SettingsSidebar() {
    const {data: session, status} = useSession();

    if (status === "loading") {
        return (
            <div className="hidden lg:block w-80 shrink-0">
                <div className="p-4">Loading...</div>
            </div>
        );
    }

    if (!session?.user) return null;

    const {user} = session;

    return (
        <aside className="hidden lg:block w-80 shrink-0 p-4 pr-0">
            <div className="space-y-6">
                {/* User Profile Card */}
                <Card className="flex flex-col items-center p-6 text-center">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        {user.image && (
                            <AvatarImage src={user.image} alt={user.name ?? ""}/>
                        )}
                        <AvatarFallback className="text-3xl">
                            {user.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Button
                        variant="secondary"
                        className="mt-4 cursor-default rounded-full bg-pink-600/20 text-pink-500 hover:bg-pink-600/30"
                    >
                        Pro Plan
                    </Button>
                </Card>

                {/* Message Usage Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message Usage</CardTitle>
                        <CardDescription>Resets 07/13/2025</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <p>Standard</p>
                                <p>
                                    <span className="font-semibold">2</span> / 1500
                                </p>
                            </div>
                            <Progress value={(2 / 1500) * 100}/>
                            <p className="mt-1 text-xs text-muted-foreground">
                                1498 messages remaining
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <p>Premium</p>
                                <p>
                                    <span className="font-semibold">4</span> / 100
                                </p>
                            </div>
                            <Progress value={4} className="[&>div]:bg-pink-500"/>
                            <p className="mt-1 text-xs text-muted-foreground">
                                96 messages remaining
                            </p>
                        </div>
                        <Button className="w-full bg-primary/80 hover:bg-primary">
                            Buy more premium credits →
                        </Button>
                    </CardContent>
                </Card>

                {/* Keyboard Shortcuts Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Keyboard Shortcuts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm">Search</p>
                            <div className="flex gap-1">
                                <Kbd>Ctrl</Kbd>
                                <Kbd>K</Kbd>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm">New Chat</p>
                            <div className="flex gap-1">
                                <Kbd>Ctrl</Kbd>
                                <Kbd>Shift</Kbd>
                                <Kbd>O</Kbd>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm">Toggle Sidebar</p>
                            <div className="flex gap-1">
                                <Kbd>Ctrl</Kbd>
                                <Kbd>B</Kbd>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </aside>
    );
}