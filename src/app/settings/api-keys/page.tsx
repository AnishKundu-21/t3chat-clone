"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";

interface ApiKeyInputProps {
    title: string;
    description: string;
    models: string[];
    placeholder: string;
    link: string;
    linkText: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
                                                     title,
                                                     description,
                                                     models,
                                                     placeholder,
                                                     link,
                                                     linkText,
                                                 }) => (
    <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">🔑</span> {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
            {models.map((model) => (
                <Badge key={model} variant="outline">
                    {model}
                </Badge>
            ))}
        </div>
        <div className="mt-4">
            <Input type="password" placeholder={placeholder}/>
            <div className="flex justify-between items-center mt-2">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary underline"
                >
                    {linkText}
                </a>
                <Button size="sm">Save</Button>
            </div>
        </div>
    </div>
);

export default function ApiKeysPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                    Bring your own API keys for select models. Messages sent using your API keys will not count towards
                    your monthly limits.
                    <br/>
                    <span className="font-semibold">Note:</span> For optional API key models, you can choose Priority
                    (always use your API key first) or Fallback (use your credits first, then your API key).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <ApiKeyInput
                    title="Anthropic API Key"
                    description="Used for the following models:"
                    models={[
                        "Claude 3.5 Sonnet",
                        "Claude 3.7 Sonnet",
                        "Claude 3.7 Sonnet (Reasoning)",
                        "Claude 4 Opus",
                        "Claude 4 Sonnet",
                        "Claude 4 Sonnet (Reasoning)",
                    ]}
                    placeholder="sk-ant-..."
                    link="https://console.anthropic.com"
                    linkText="Get your API key from Anthropic's Console"
                />
                <Separator/>
                <ApiKeyInput
                    title="OpenAI API Key"
                    description="Used for the following models:"
                    models={["GPT 4.0", "o3", "o3 Pro"]}
                    placeholder="sk-..."
                    link="https://platform.openai.com"
                    linkText="Get your API key from OpenAI's Dashboard"
                />
                <Separator/>
                <ApiKeyInput
                    title="Google API Key"
                    description="Used for the following models:"
                    models={[
                        "Gemini 2.0 Flash",
                        "Gemini 2.5 Flash Lite",
                        "Gemini 2.5 Flash",
                        "Gemini 2.5 Flash (Thinking)",
                        "Gemini 2.5 Flash Lite",
                        "Gemini 2.5 Flash-Lite (Thinking)",
                        "Gemini 2.5 Pro",
                    ]}
                    placeholder="AIza..."
                    link="https://console.cloud.google.com"
                    linkText="Get your API key from Google Cloud Console"
                />
            </CardContent>
        </Card>
    );
}