export interface Message {
    role: "user" | "assistant";
    content: string;
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: number;
  }
  