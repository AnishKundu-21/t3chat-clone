import { ArrowUpRight } from "lucide-react";

interface PromptCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function PromptCard({ title, description, onClick }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left relative w-full"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <ArrowUpRight className="h-4 w-4 absolute top-4 right-4 text-muted-foreground" />
    </button>
  );
}
