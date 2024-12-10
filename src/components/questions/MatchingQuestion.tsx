import React, { useState } from 'react';
import { Question } from '../../types/quiz';

interface MatchingQuestionProps {
  question: Question;
  onAnswerSubmit: (answers: string[]) => void;
}

export function MatchingQuestion({ question, onAnswerSubmit }: MatchingQuestionProps) {
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const handleLeftClick = (item: string) => {
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (selectedLeft) {
      const newMatches = [...matches];
      newMatches.push(`${selectedLeft}:${item}`);
      setMatches(newMatches);
      setSelectedLeft(null);
      onAnswerSubmit(newMatches);
    }
  };

  const removeMatch = (index: number) => {
    const newMatches = [...matches];
    newMatches.splice(index, 1);
    setMatches(newMatches);
    onAnswerSubmit(newMatches);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Items</h3>
          {question.matchingPairs?.map(({ left }) => (
            <button
              key={left}
              onClick={() => handleLeftClick(left)}
              className={`w-full p-3 text-left rounded-lg border ${
                selectedLeft === left ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
              disabled={matches.some(match => match.startsWith(left + ':'))}
            >
              {left}
            </button>
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Matches</h3>
          {question.matchingPairs?.map(({ right }) => (
            <button
              key={right}
              onClick={() => handleRightClick(right)}
              className={`w-full p-3 text-left rounded-lg border border-gray-200 ${
                selectedLeft ? 'hover:border-indigo-200 hover:bg-indigo-50' : ''
              }`}
              disabled={matches.some(match => match.endsWith(':' + right))}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Your Matches:</h3>
        <div className="space-y-2">
          {matches.map((match, index) => {
            const [left, right] = match.split(':');
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-900">{left} → {right}</span>
                <button
                  onClick={() => removeMatch(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}