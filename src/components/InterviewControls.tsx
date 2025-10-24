import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InterviewControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendText: (text: string) => void;
}

const InterviewControls = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onSendText,
}: InterviewControlsProps) => {
  const [textInput, setTextInput] = useState("");

  const handleSendText = () => {
    if (textInput.trim()) {
      onSendText(textInput);
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isProcessing}
          className={`
            w-20 h-20 rounded-full transition-smooth
            ${isRecording 
              ? 'bg-destructive hover:bg-destructive/90 shadow-glow' 
              : 'gradient-primary hover:opacity-90'
            }
          `}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isRecording
          ? "Recording... Click to stop"
          : isProcessing
          ? "Processing your response..."
          : "Click to start speaking"}
      </p>

      {/* Text Input Alternative */}
      <div className="relative">
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Or type your response here..."
          className="min-h-[100px] pr-12 resize-none"
          disabled={isProcessing}
        />
        <Button
          size="icon"
          onClick={handleSendText}
          disabled={!textInput.trim() || isProcessing}
          className="absolute right-2 bottom-2 rounded-full gradient-primary"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewControls;
