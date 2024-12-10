import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Home, Trophy, Info, FileText } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">CodeQuiz</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/question-papers" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <FileText className="h-5 w-5" />
              <span>Question Papers</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}