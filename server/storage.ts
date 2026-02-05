import { Question, InsertQuestion } from "@shared/schema";

export interface IStorage {
  generateQuestion(): Promise<Question>;
  checkAnswer(id: number, answer: number): Promise<{ correct: boolean, correctAnswer: number, message: string }>;
}

export class MemStorage implements IStorage {
  private questions: Map<number, Question>;
  private currentId: number;

  constructor() {
    this.questions = new Map();
    this.currentId = 1;
  }

  async generateQuestion(): Promise<Question> {
    const id = this.currentId++;
    
    // Logic: numbers 1-20, whole numbers only
    const operators = ['+', '-', '*', '/'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let text = "";
    let answer = 0;

    switch (op) {
      case '+':
        answer = a + b;
        text = `${a} + ${b}`;
        break;
      case '-':
        // Ensure result is non-negative
        if (a < b) [a, b] = [b, a];
        answer = a - b;
        text = `${a} - ${b}`;
        break;
      case '*':
        // Keep numbers smaller for multiplication to be manageable? 
        // Instructions say "Use numbers from 1 to 20". 20*20 = 400. That's fine.
        answer = a * b;
        text = `${a} × ${b}`;
        break;
      case '/':
        // Ensure divisible and whole number result
        // Strategy: Generate answer and divisor, then calculate dividend
        // But requirements say "Use numbers from 1 to 20".
        // Let's interpret: operands a and b are 1-20? Or result?
        // "Use numbers from 1 to 20" likely applies to the operands generated.
        // For division a / b = c. 
        // To guarantee a/b is whole and valid using 1-20:
        // Let b be 1-20. Let a be a multiple of b, also within reasonable range?
        // Or generate 'answer' (1-20) and 'divisor' (1-20), then dividend = answer * divisor.
        // But dividend might exceed 20. "Use numbers from 1 to 20" is ambiguous.
        // Does it mean the question numbers are 1-20? Or the answer?
        // "Ensure all generated questions always produce valid whole-number answers"
        
        // Let's try to pick 'b' (1-10) and 'answer' (1-10) to keep 'a' reasonable (1-100).
        // Or strict interpretation: a and b must be 1-20.
        // We need a such that a % b === 0.
        // We can pick 'a' (1-20), then find factors of 'a' for 'b'.
        
        a = Math.floor(Math.random() * 20) + 1;
        const factors = [];
        for (let i = 1; i <= a; i++) {
          if (a % i === 0) factors.push(i);
        }
        b = factors[Math.floor(Math.random() * factors.length)];
        answer = a / b;
        text = `${a} ÷ ${b}`;
        break;
    }

    const question: Question = {
      id,
      questionText: `${text} = ?`,
      correctAnswer: answer,
    };

    this.questions.set(id, question);
    return question;
  }

  async checkAnswer(id: number, userAnswer: number): Promise<{ correct: boolean, correctAnswer: number, message: string }> {
    const question = this.questions.get(id);
    if (!question) {
      return { correct: false, correctAnswer: 0, message: "Question expired" };
    }

    // Optional: Delete question after answering to prevent replay? 
    // Or keep it. Let's keep it simple.
    // this.questions.delete(id); 

    const correct = question.correctAnswer === userAnswer;
    return {
      correct,
      correctAnswer: question.correctAnswer,
      message: correct ? "Correct! 🎉" : "Try again ❌"
    };
  }
}

export const storage = new MemStorage();
