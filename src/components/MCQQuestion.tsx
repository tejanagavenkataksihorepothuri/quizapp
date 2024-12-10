import React from 'react';
import { Question } from '../types/quiz';
import clsx from 'clsx';

interface MCQQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}

export function MCQQuestion({ question, selectedAnswer, onAnswerSelect }: MCQQuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
      <div className="space-y-2">
        {question.options?.map((option) => (
          <button
            key={option}
            onClick={() => onAnswerSelect(option)}
            className={clsx(
              'w-full p-4 text-left rounded-lg border transition-colors',
              selectedAnswer === option
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}