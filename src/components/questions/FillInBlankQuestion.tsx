import React, { useState } from 'react';
import { Question } from '../../types/quiz';

interface FillInBlankQuestionProps {
  question: Question;
  onAnswerSubmit: (answers: string[]) => void;
}

export function FillInBlankQuestion({ question, onAnswerSubmit }: FillInBlankQuestionProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(question.blanks?.length || 0).fill(''));

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswerSubmit(newAnswers);
  };

  const checkAnswer = (answer: string, correctAnswer: string): boolean => {
    return answer.toLowerCase() === correctAnswer.toLowerCase();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
      
      <div className="space-y-3">
        {question.blanks?.map((blank, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-700">Blank {index + 1}:</span>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your answer"
            />
            {question.blankAnswers && answers[index] && (
              <span className={`text-sm ${
                checkAnswer(answers[index], question.blankAnswers[index])
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {checkAnswer(answers[index], question.blankAnswers[index])
                  ? '✓ Correct'
                  : '✗ Incorrect'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}