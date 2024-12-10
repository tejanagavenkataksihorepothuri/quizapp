import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { Question, TestCase } from '../types/quiz';

export function QuestionManager() {
  const { customQuestions, addQuestion, editQuestion, deleteQuestion } = useQuizStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'mcq',
    options: [''],
    points: 10,
    testCases: [{ input: '', expectedOutput: '' }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidQuestion(currentQuestion)) {
      const questionWithId = {
        ...currentQuestion,
        id: isEditing ? currentQuestion.id! : Date.now()
      } as Question;
      
      if (isEditing) {
        editQuestion(questionWithId);
      } else {
        addQuestion(questionWithId);
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentQuestion({
      type: 'mcq',
      options: [''],
      points: 10,
      testCases: [{ input: '', expectedOutput: '' }]
    });
  };

  const handleEdit = (question: Question) => {
    setIsEditing(true);
    setCurrentQuestion(question);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Question Manager</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                type: e.target.value as 'mcq' | 'programming'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="programming">Programming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question Text
            </label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          {currentQuestion.type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex mt-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(currentQuestion.options || [])];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...(currentQuestion.options || [])];
                      newOptions.splice(index, 1);
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions
                      });
                    }}
                    className="ml-2 text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCurrentQuestion({
                  ...currentQuestion,
                  options: [...(currentQuestion.options || []), '']
                })}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
          )}

          {currentQuestion.type === 'programming' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Initial Code
                </label>
                <textarea
                  value={currentQuestion.initialCode}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    initialCode: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Cases
                </label>
                {currentQuestion.testCases?.map((testCase, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <input
                      type="text"
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) => {
                        const newTestCases = [...(currentQuestion.testCases || [])];
                        newTestCases[index] = {
                          ...newTestCases[index],
                          input: e.target.value
                        };
                        setCurrentQuestion({
                          ...currentQuestion,
                          testCases: newTestCases
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Expected Output"
                      value={testCase.expectedOutput}
                      onChange={(e) => {
                        const newTestCases = [...(currentQuestion.testCases || [])];
                        newTestCases[index] = {
                          ...newTestCases[index],
                          expectedOutput: e.target.value
                        };
                        setCurrentQuestion({
                          ...currentQuestion,
                          testCases: newTestCases
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newTestCases = [...(currentQuestion.testCases || [])];
                        newTestCases.splice(index, 1);
                        setCurrentQuestion({
                          ...currentQuestion,
                          testCases: newTestCases
                        });
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentQuestion({
                    ...currentQuestion,
                    testCases: [...(currentQuestion.testCases || []), { input: '', expectedOutput: '' }]
                  })}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Test Case
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Points
            </label>
            <input
              type="number"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                points: parseInt(e.target.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Questions</h3>
          <div className="space-y-4">
            {customQuestions.map((question) => (
              <div
                key={question.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-gray-500">
                    Type: {question.type} | Points: {question.points}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function isValidQuestion(question: Partial<Question>): question is Question {
  return !!(
    question.type &&
    question.question &&
    question.points &&
    (question.type === 'mcq' ? question.options?.length : true) &&
    (question.type === 'programming' ? question.testCases?.length : true)
  );
}