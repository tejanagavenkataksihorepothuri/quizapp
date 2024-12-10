import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Play } from 'lucide-react';
import { useQuestionStore } from '../store/questionStore';
import { useQuizStore } from '../store/quizStore';

export function QuestionPapers() {
  const navigate = useNavigate();
  const { questionPapers, deleteQuestionPaper } = useQuestionStore();
  const { createQuizSession } = useQuizStore();
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [quizName, setQuizName] = useState('');
  const [showStartQuiz, setShowStartQuiz] = useState(false);

  const handleStartQuiz = () => {
    const paper = questionPapers.find(p => p.id === selectedPaper);
    if (!paper || !quizName) return;

    const session = createQuizSession(quizName, paper.questions);
    navigate(`/host-dashboard/${session.joinCode}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Question Papers</h1>
        <button
          onClick={() => navigate('/create-quiz')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {questionPapers.map((paper) => (
            <li key={paper.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {paper.questions.length} questions • Created on {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedPaper(paper.id);
                      setShowStartQuiz(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Quiz
                  </button>
                  <button
                    onClick={() => deleteQuestionPaper(paper.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showStartQuiz && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Start New Quiz Session</h2>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="Enter quiz name"
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowStartQuiz(false);
                  setSelectedPaper(null);
                  setQuizName('');
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleStartQuiz}
                disabled={!quizName}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}