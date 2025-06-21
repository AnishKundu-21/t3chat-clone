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
import {ArrowUpRight} from "lucide-react";

interface ContactLinkProps {
    title: string;
    description: string;
    href: string;
}

const ContactLink: React.FC<ContactLinkProps> = ({
                                                     title,
                                                     description,
                                                     href,
                                                 }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors relative"
    >
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <ArrowUpRight className="h-4 w-4 absolute top-4 right-4 text-muted-foreground"/>
    </a>
);

export default function ContactUsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>We're here to help!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ContactLink
                    title="Have a cool feature idea?"
                    description="Vote on upcoming features or suggest your own"
                    href="#"
                />
                <ContactLink
                    title="Found a non-critical bug?"
                    description="UI glitches or formatting issues? Report them here :)"
                    href="#"
                />
                <ContactLink
                    title="Having a critical or billing issue?"
                    description="Email us for priority support - support@t3ping.gg"
                    href="mailto:support@t3ping.gg"
                />
                <ContactLink
                    title="Want to join the community?"
                    description="Come hang out in our Discord! Chat with the team and other users"
                    href="#"
                />
                <ContactLink
                    title="Privacy Policy"
                    description="Read our privacy policy and data handling practices"
                    href="#"
                />
                <ContactLink
                    title="Terms of Service"
                    description="Review our terms of service and usage guidelines"
                    href="#"
                />
            </CardContent>
        </Card>
    );
}