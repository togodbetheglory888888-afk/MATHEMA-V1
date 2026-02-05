import { useState, useRef, useEffect } from "react";
import { useNextQuestion, useCheckAnswer } from "@/hooks/use-math-game";
import { MathCard } from "@/components/MathCard";
import { GameButton } from "@/components/GameButton";
import { NumberInput } from "@/components/NumberInput";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Loader2, Sparkles, Trophy, Brain } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function Game() {
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const { data: question, isLoading, error } = useNextQuestion();
  const checkMutation = useCheckAnswer();

  // Focus input when question changes
  useEffect(() => {
    if (question && !feedback) {
      inputRef.current?.focus();
    }
  }, [question, feedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    const numAnswer = parseInt(answer, 10);
    
    checkMutation.mutate(
      { id: question.id, answer: numAnswer },
      {
        onSuccess: (data) => {
          setTotal((prev) => prev + 1);
          
          if (data.correct) {
            setScore((prev) => prev + 1);
            setFeedback("correct");
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FFA500', '#FF4500', '#8A2BE2', '#00CED1']
            });

            // Wait 1.5s then get next question
            setTimeout(() => {
              setAnswer("");
              setFeedback(null);
              queryClient.invalidateQueries({ queryKey: [api.questions.next.path] });
            }, 1500);
          } else {
            setFeedback("incorrect");
            // Shake effect handled by animation key
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p className="text-xl font-bold">Oops! Something went wrong loading the game.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 text-primary/10 rotate-12">
        <Brain className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 right-10 text-accent/10 -rotate-12">
        <Sparkles className="w-32 h-32" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-display text-primary tracking-wider drop-shadow-sm">
            MATHEMATH
          </h1>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-border flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg text-foreground">
              {score} / {total}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {question && (
            <MathCard key={question.id} className="text-center">
              <motion.div
                key={feedback} // Trigger shake on incorrect
                animate={feedback === "incorrect" ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="text-6xl md:text-7xl font-bold font-display text-foreground mb-2">
                    {question.questionText}
                  </h2>
                  <p className="text-muted-foreground font-medium">What is the answer?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <NumberInput
                    ref={inputRef}
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (feedback === "incorrect") setFeedback(null);
                    }}
                    placeholder="?"
                    disabled={feedback === "correct" || checkMutation.isPending}
                    autoFocus
                  />

                  <div className="h-24 flex flex-col items-center justify-center">
                    {feedback === "correct" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-[hsl(142,76%,36%)] font-display flex items-center gap-2"
                      >
                        Correct! 🎉
                      </motion.div>
                    ) : feedback === "incorrect" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-destructive font-display mb-4"
                      >
                        Try again! ❌
                      </motion.div>
                    ) : (
                      <GameButton
                        type="submit"
                        disabled={!answer || checkMutation.isPending}
                        className="w-full"
                      >
                        {checkMutation.isPending ? "Checking..." : "Submit Answer"}
                      </GameButton>
                    )}
                  </div>
                </form>
              </motion.div>
            </MathCard>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
