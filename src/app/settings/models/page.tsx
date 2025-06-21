"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {Search} from "lucide-react";

interface Model {
    id: string;
    name: string;
    description: string;
    features: string[];
    enabled: boolean;
    isThinking?: boolean;
}

const initialModels: Model[] = [
    {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        description: "Gemini 2.5 Flash Lite is a member of the Gemini 2.5 series of models, a suite of highly-capable, natively multimodal models.",
        features: ["Vision", "PDFs", "Search"],
        enabled: true,
    },
    {
        id: "gemini-2.5-flash-lite-thinking",
        name: "Gemini 2.5 Flash Lite (Thinking)",
        description: "Gemini 2.5 Flash Lite is a member of the Gemini 2.5 series of models, a suite of highly-capable, natively multimodal models.",
        features: ["Vision", "PDFs", "Search", "Effort Control"],
        enabled: true,
        isThinking: true,
    },
    {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Google's flagship model, known for speed and accuracy (and also web search).",
        features: ["Vision", "PDFs", "Search"],
        enabled: false,
    },
];

export default function ModelsPage() {
    const [models, setModels] = React.useState<Model[]>(initialModels);

    const handleToggle = (id: string) => {
        setModels((prevModels) =>
            prevModels.map((model) =>
                model.id === id ? {...model, enabled: !model.enabled} : model
            )
        );
    };

    const handleSelectRecommended = () => {
        // Placeholder for selecting recommended models
        console.log("Selecting recommended models");
    };

    const handleUnselectAll = () => {
        setModels((prevModels) =>
            prevModels.map((model) => ({...model, enabled: false}))
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Available Models</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                            Choose which models appear in your model selector. This won't affect existing conversations.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Filter by features</Button>
                        <Button variant="outline" onClick={handleSelectRecommended}>
                            Select Recommended
                        </Button>
                        <Button variant="secondary" onClick={handleUnselectAll}>
                            Unselect All
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {models.map((model) => (
                    <div
                        key={model.id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                    >
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                {model.name}
                                {model.isThinking && (
                                    <span title="Thinking model">🤔</span>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {model.description}{" "}
                                <Button variant="link" className="p-0 h-auto">Show more</Button>
                            </p>
                            <div className="flex gap-2">
                                {model.features.map((feature) => (
                                    <Badge key={feature} variant="secondary">{feature}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Switch
                                checked={model.enabled}
                                onCheckedChange={() => handleToggle(model.id)}
                            />
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Search className="h-4 w-4 mr-1"/>
                                Search URL
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}