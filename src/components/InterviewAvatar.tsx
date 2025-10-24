import { Bot } from "lucide-react";

interface InterviewAvatarProps {
  isSpeaking: boolean;
}

const InterviewAvatar = ({ isSpeaking }: InterviewAvatarProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-soft blur-2xl" />
      )}
      
      {/* Main avatar container */}
      <div className={`
        relative w-48 h-48 rounded-full gradient-primary
        flex items-center justify-center shadow-glow
        transition-smooth
        ${isSpeaking ? 'scale-110' : 'scale-100'}
      `}>
        <Bot className="w-24 h-24 text-primary-foreground" strokeWidth={1.5} />
      </div>

      {/* Voice wave indicators */}
      {isSpeaking && (
        <div className="absolute -bottom-8 flex gap-1.5 items-end h-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-primary rounded-full animate-wave"
              style={{
                height: '60%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewAvatar;
