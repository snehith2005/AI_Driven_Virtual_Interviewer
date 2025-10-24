import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import InterviewAvatar from "@/components/InterviewAvatar";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import InterviewControls from "@/components/InterviewControls";
import { useInterviewChat } from "@/hooks/useInterviewChat";
import { SpeechRecognitionService } from "@/utils/speechRecognition";
import { Sparkles } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [interviewMode, setInterviewMode] = useState<'technical' | 'behavioral' | 'general'>('general');
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRecognition] = useState(() => {
    try {
      return new SpeechRecognitionService();
    } catch (error) {
      console.error('Speech recognition not available:', error);
      return null;
    }
  });
  
  const { messages, isLoading, sendMessage, resetChat } = useInterviewChat(interviewMode);

  const startInterview = async () => {
    setIsInterviewActive(true);
    resetChat();
    
    // Send initial greeting
    const greetings = {
      technical: "Hello! I'm your AI technical interviewer. I'll be asking you questions about programming and problem-solving. Are you ready to begin?",
      behavioral: "Hello! I'm your AI behavioral interviewer. I'll be asking about your past experiences and how you handle various situations. Shall we start?",
      general: "Hello! I'm your AI interviewer. I'll be asking you various questions to get to know you better. Ready to begin?"
    };
    
    await sendMessage("Start the interview");
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    setIsRecording(false);
    resetChat();
    toast({
      title: "Interview Ended",
      description: "Thank you for your time!",
    });
  };

  const startRecording = async () => {
    if (!speechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRecording(true);
      
      speechRecognition.start(
        async (text) => {
          // Successfully got speech text
          setIsRecording(false);
          
          if (text && text.trim()) {
            toast({
              title: "Speech Recognized",
              description: "Processing your response...",
            });
            await handleSendText(text);
          } else {
            toast({
              title: "No Speech Detected",
              description: "Please try speaking again",
              variant: "destructive",
            });
          }
        },
        (error) => {
          // Error occurred
          setIsRecording(false);
          toast({
            title: "Recognition Error",
            description: error,
            variant: "destructive",
          });
        }
      );

      toast({
        title: "Listening",
        description: "Speak your answer now",
      });
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Microphone Error",
        description: error instanceof Error ? error.message : "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    setIsRecording(false);
  };

  const handleSendText = async (text: string) => {
    setIsSpeaking(true);
    await sendMessage(text);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  if (!isInterviewActive) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-glow">
        <Card className="w-full max-w-md p-8 shadow-medium">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent gradient-primary">
                AI Interview Assistant
              </h1>
              <p className="text-muted-foreground">
                Practice your interview skills with AI
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Type</label>
                <Select value={interviewMode} onValueChange={(value: any) => setInterviewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Interview</SelectItem>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={startInterview}
                className="w-full gradient-primary hover:opacity-90 transition-smooth"
                size="lg"
              >
                Start Interview
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Interview in Progress</h1>
            <p className="text-muted-foreground capitalize">{interviewMode} Interview</p>
          </div>
          <Button variant="outline" onClick={endInterview}>
            End Interview
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Avatar & Controls */}
          <div className="space-y-8">
            <Card className="p-8 shadow-medium">
              <div className="flex flex-col items-center gap-8">
                <InterviewAvatar isSpeaking={isSpeaking || isLoading} />
                <InterviewControls
                  isRecording={isRecording}
                  isProcessing={isLoading}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onSendText={handleSendText}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Transcript */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Interview Transcript</h2>
            <TranscriptDisplay messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
