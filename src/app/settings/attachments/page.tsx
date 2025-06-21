"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";

interface Attachment {
    id: string;
    name: string;
    type: string;
    size: string;
}

const attachments: Attachment[] = [
    {
        id: "1",
        name: "pasted-846443.png",
        type: "image/png",
        size: "849 KB",
    },
    {
        id: "2",
        name: "pasted-959024.png",
        type: "image/png",
        size: "1.2 MB",
    },
];

export default function AttachmentsPage() {
    const [selected, setSelected] = React.useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        setSelected(checked ? attachments.map((a) => a.id) : []);
    };

    const handleSelect = (id: string, checked: boolean) => {
        setSelected((prev) =>
            checked ? [...prev, id] : prev.filter((sId) => sId !== id)
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                    Manage your uploaded files and attachments. Note that deleting files here will remove them from the
                    relevant threads, but not delete the threads. This may lead to unexpected behavior if you delete a
                    file that is still being used in a thread.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 border-b pb-2 mb-2">
                    <Checkbox
                        id="select-all-attachments"
                        onCheckedChange={handleSelectAll}
                        checked={
                            selected.length === attachments.length && attachments.length > 0
                        }
                    />
                    <label htmlFor="select-all-attachments" className="text-sm font-medium">
                        Select All
                    </label>
                </div>
                <div className="space-y-2">
                    {attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    id={`attachment-${attachment.id}`}
                                    checked={selected.includes(attachment.id)}
                                    onCheckedChange={(checked) => handleSelect(attachment.id, !!checked)}
                                />
                                <div>
                                    <label
                                        htmlFor={`attachment-${attachment.id}`}
                                        className="font-medium"
                                    >
                                        {attachment.name}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        {attachment.type}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive">
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}