import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Question, ProgrammingLanguage } from '../types/quiz';

interface ProgrammingQuestionProps {
  question: Question;
  onAnswerSubmit: (code: string) => void;
  selectedLanguage?: ProgrammingLanguage;
  onLanguageChange?: (language: ProgrammingLanguage) => void;
  availableLanguages?: ProgrammingLanguage[];
}

export function ProgrammingQuestion({ 
  question, 
  onAnswerSubmit,
  selectedLanguage = 'javascript',
  onLanguageChange,
  availableLanguages
}: ProgrammingQuestionProps) {
  const [code, setCode] = useState(
    question.initialCode?.[selectedLanguage] || ''
  );

  const languages = availableLanguages || Object.keys(question.initialCode || {}) as ProgrammingLanguage[];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as ProgrammingLanguage;
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    setCode(question.initialCode?.[newLanguage] || '');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
      
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-sm font-medium text-gray-700">
          Programming Language:
        </label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {question.testCases && question.testCases.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Test Cases:</h3>
          <div className="space-y-2">
            {question.testCases.map((testCase, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-gray-700">Test Case {index + 1}:</div>
                {testCase.description && (
                  <div className="text-gray-600 mb-1">{testCase.description}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Input:</span> {testCase.input}
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span> {testCase.expectedOutput}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-[400px] w-full border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={selectedLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => {
            setCode(value || '');
            onAnswerSubmit(value || '');
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}