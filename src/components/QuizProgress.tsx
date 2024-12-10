import React from 'react';
import { useQuizStore } from '../store/quizStore';

export function QuizProgress({ totalQuestions }: { totalQuestions: number }) {
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
        style={{
          width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
        }}
      />
      <p className="text-sm text-gray-600 mt-2">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </p>
    </div>
  );
}