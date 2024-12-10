import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

interface QuizNavigationProps {
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

export function QuizNavigation({ currentIndex, onNext, onPrevious, onFinish }: QuizNavigationProps) {
  const questions = useQuizStore((state) => state.getAllQuestions());
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </button>
      
      {isLastQuestion ? (
        <button
          onClick={onFinish}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Finish Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
}