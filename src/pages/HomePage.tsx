import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Plus, Users } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <div className="text-center">
          <Brain className="h-20 w-20 text-indigo-600 mx-auto" />
          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            Interactive Code Quiz Platform
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Create, share, and participate in coding quizzes with real-time feedback
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/create-quiz')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Quiz
            </button>
            
            <button
              onClick={() => navigate('/join')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-100 bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Quiz
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Create Quiz</h3>
              <p className="mt-2 text-gray-600">Design your own quiz with multiple choice and programming questions.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
              <p className="mt-2 text-gray-600">Monitor participant progress and results as they happen.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Instant Results</h3>
              <p className="mt-2 text-gray-600">Get immediate feedback on quiz performance and code execution.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}