export type QuestionType = 'mcq' | 'programming' | 'fillInBlank' | 'matching';
export type ProgrammingLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript' | 'html';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  imageUrl?: string;
  points: number;
  
  // MCQ specific
  options?: string[];
  correctAnswer?: string;
  
  // Programming specific
  language?: ProgrammingLanguage;
  initialCode?: Record<ProgrammingLanguage, string>;
  testCases?: TestCase[];
  
  // Fill in the blank specific
  blanks?: string[];
  blankAnswers?: string[];
  
  // Matching specific
  matchingPairs?: {
    left: string;
    right: string;
  }[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  score: number;
  timeStarted?: Date;
  timeEnded?: Date;
  customQuestions: Question[];
  activeQuizzes: QuizSession[];
  participants: Participant[];
}

export interface QuizSession {
  id: string;
  joinCode: string;
  name: string;
  questions: Question[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  quizId: string;
  score: number;
  answers: Record<number, string | string[]>;
  completedAt?: Date;
  selectedLanguage?: ProgrammingLanguage;
}