import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { CreateQuizSession } from './pages/CreateQuizSession';
import { JoinQuiz } from './pages/JoinQuiz';
import { HostDashboard } from './pages/HostDashboard';
import { QuestionPapers } from './pages/QuestionPapers';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:joinCode" element={<QuizPage />} />
          <Route path="/create-quiz" element={<CreateQuizSession />} />
          <Route path="/join" element={<JoinQuiz />} />
          <Route path="/host-dashboard/:joinCode" element={<HostDashboard />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
        </Routes>
      </div>
    </Router>
  );
}