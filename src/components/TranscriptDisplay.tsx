import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TranscriptDisplayProps {
  messages: Message[];
}

const TranscriptDisplay = ({ messages }: TranscriptDisplayProps) => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-xl border border-border bg-card p-6">
      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Your interview transcript will appear here...
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'assistant'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'gradient-primary text-primary-foreground shadow-soft'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-accent" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default TranscriptDisplay;
