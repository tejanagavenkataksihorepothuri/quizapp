import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Question, ProgrammingLanguage } from '../types/quiz';
import { PlusCircle, Trash2 } from 'lucide-react';

const languageOptions: ProgrammingLanguage[] = ['javascript', 'python', 'java', 'cpp', 'c', 'html'];

const defaultCode: Record<ProgrammingLanguage, string> = {
  c: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  python: '# Your code here',
  javascript: 'function solution(input) {\n    // Your code here\n}',
  html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Solution</title>\n</head>\n<body>\n    <!-- Your code here -->\n</body>\n</html>'
};

export function CreateQuizSession() {
  const navigate = useNavigate();
  const { createQuizSession } = useQuizStore();
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 10
      }
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateSession = () => {
    if (!quizName || questions.length === 0) return;

    const formattedQuestions = questions.map((q, index) => ({
      ...q,
      id: index + 1
    })) as Question[];

    const session = createQuizSession(quizName, formattedQuestions);
    navigate(`/host-dashboard/${session.joinCode}`);
  };

  const renderQuestionFields = (question: Partial<Question>, index: number) => {
    switch (question.type) {
      case 'mcq':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="mt-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[optionIndex] = e.target.value;
                    updateQuestion(index, 'options', newOptions);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder={`Option ${optionIndex + 1}`}
                />
              </div>
            ))}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
              <select
                value={question.correctAnswer}
                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select correct answer</option>
                {question.options?.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option || `Option ${optionIndex + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'programming':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Programming Languages
              </label>
              <div className="space-y-2">
                {languageOptions.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={question.initialCode?.[lang] !== undefined}
                      onChange={(e) => {
                        const newInitialCode = { ...(question.initialCode || {}) };
                        if (e.target.checked) {
                          newInitialCode[lang] = defaultCode[lang];
                        } else {
                          delete newInitialCode[lang];
                        }
                        updateQuestion(index, 'initialCode', newInitialCode);
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{lang.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            {Object.keys(question.initialCode || {}).length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Initial Code</label>
                {Object.entries(question.initialCode || {}).map(([lang, code]) => (
                  <div key={lang} className="mt-2">
                    <label className="block text-sm font-medium text-gray-600">
                      {lang.toUpperCase()}
                    </label>
                    <textarea
                      value={code}
                      onChange={(e) => {
                        const newInitialCode = { ...(question.initialCode || {}) };
                        newInitialCode[lang as ProgrammingLanguage] = e.target.value;
                        updateQuestion(index, 'initialCode', newInitialCode);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Test Cases</label>
              {(question.testCases || []).map((testCase, testIndex) => (
                <div key={testIndex} className="mt-2 grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={testCase.input}
                    onChange={(e) => {
                      const newTestCases = [...(question.testCases || [])];
                      newTestCases[testIndex] = {
                        ...newTestCases[testIndex],
                        input: e.target.value
                      };
                      updateQuestion(index, 'testCases', newTestCases);
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Input"
                  />
                  <input
                    type="text"
                    value={testCase.expectedOutput}
                    onChange={(e) => {
                      const newTestCases = [...(question.testCases || [])];
                      newTestCases[testIndex] = {
                        ...newTestCases[testIndex],
                        expectedOutput: e.target.value
                      };
                      updateQuestion(index, 'testCases', newTestCases);
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Expected Output"
                  />
                  <input
                    type="text"
                    value={testCase.description || ''}
                    onChange={(e) => {
                      const newTestCases = [...(question.testCases || [])];
                      newTestCases[testIndex] = {
                        ...newTestCases[testIndex],
                        description: e.target.value
                      };
                      updateQuestion(index, 'testCases', newTestCases);
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Description (optional)"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTestCases = [
                    ...(question.testCases || []),
                    { input: '', expectedOutput: '', description: '' }
                  ];
                  updateQuestion(index, 'testCases', newTestCases);
                }}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Test Case
              </button>
            </div>
          </>
        );

      case 'fillInBlank':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Blanks</label>
            <div className="space-y-2">
              {(question.blanks || ['']).map((blank, blankIndex) => (
                <div key={blankIndex} className="flex space-x-2">
                  <input
                    type="text"
                    value={blank}
                    onChange={(e) => {
                      const newBlanks = [...(question.blanks || [''])];
                      newBlanks[blankIndex] = e.target.value;
                      updateQuestion(index, 'blanks', newBlanks);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={`Blank ${blankIndex + 1}`}
                  />
                  <input
                    type="text"
                    value={question.blankAnswers?.[blankIndex] || ''}
                    onChange={(e) => {
                      const newAnswers = [...(question.blankAnswers || [''])];
                      newAnswers[blankIndex] = e.target.value;
                      updateQuestion(index, 'blankAnswers', newAnswers);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Correct Answer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newBlanks = [...(question.blanks || [])];
                      const newAnswers = [...(question.blankAnswers || [])];
                      newBlanks.splice(blankIndex, 1);
                      newAnswers.splice(blankIndex, 1);
                      updateQuestion(index, 'blanks', newBlanks);
                      updateQuestion(index, 'blankAnswers', newAnswers);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newBlanks = [...(question.blanks || []), ''];
                  const newAnswers = [...(question.blankAnswers || []), ''];
                  updateQuestion(index, 'blanks', newBlanks);
                  updateQuestion(index, 'blankAnswers', newAnswers);
                }}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Blank
              </button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Matching Pairs</label>
            <div className="space-y-2">
              {(question.matchingPairs || [{ left: '', right: '' }]).map((pair, pairIndex) => (
                <div key={pairIndex} className="flex space-x-2">
                  <input
                    type="text"
                    value={pair.left}
                    onChange={(e) => {
                      const newPairs = [...(question.matchingPairs || [])];
                      newPairs[pairIndex] = { ...newPairs[pairIndex], left: e.target.value };
                      updateQuestion(index, 'matchingPairs', newPairs);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Left Item"
                  />
                  <input
                    type="text"
                    value={pair.right}
                    onChange={(e) => {
                      const newPairs = [...(question.matchingPairs || [])];
                      newPairs[pairIndex] = { ...newPairs[pairIndex], right: e.target.value };
                      updateQuestion(index, 'matchingPairs', newPairs);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Right Item"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPairs = [...(question.matchingPairs || [])];
                      newPairs.splice(pairIndex, 1);
                      updateQuestion(index, 'matchingPairs', newPairs);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newPairs = [...(question.matchingPairs || []), { left: '', right: '' }];
                  updateQuestion(index, 'matchingPairs', newPairs);
                }}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Pair
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quiz Name</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter quiz name"
            />
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Question Type</label>
                  <select
                    value={question.type}
                    onChange={(e) => {
                      const type = e.target.value as Question['type'];
                      let newQuestion: Partial<Question> = { ...question, type };
                      
                      switch (type) {
                        case 'mcq':
                          newQuestion.options = ['', '', '', ''];
                          break;
                        case 'fillInBlank':
                          newQuestion.blanks = [''];
                          newQuestion.blankAnswers = [''];
                          break;
                        case 'matching':
                          newQuestion.matchingPairs = [{ left: '', right: '' }];
                          break;
                        case 'programming':
                          newQuestion.initialCode = {};
                          newQuestion.testCases = [{ input: '', expectedOutput: '', description: '' }];
                          break;
                      }
                      
                      const updatedQuestions = [...questions];
                      updatedQuestions[index] = newQuestion;
                      setQuestions(updatedQuestions);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="programming">Programming</option>
                    <option value="fillInBlank">Fill in the Blanks</option>
                    <option value="matching">Matching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Question Text</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                {renderQuestionFields(question, index)}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Points</label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateSession}
              disabled={!quizName || questions.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Quiz Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}