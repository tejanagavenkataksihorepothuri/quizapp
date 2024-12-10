import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { QuizProgress } from '../components/QuizProgress';
import { MCQQuestion } from '../components/MCQQuestion';
import { ProgrammingQuestion } from '../components/ProgrammingQuestion';
import { QuizNavigation } from '../components/QuizNavigation';

export function QuizPage() {
  const navigate = useNavigate();
  const { 
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    previousQuestion,
    endQuiz,
    getAllQuestions
  } = useQuizStore();

  const questions = getAllQuestions();
  const currentQuestion = questions[currentQuestionIndex];

  const handleFinish = () => {
    endQuiz();
    navigate('/results');
  };

  const handleAnswerSubmit = (answer: string) => {
    setAnswer(currentQuestion.id, answer);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <QuizProgress />
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        {currentQuestion.type === 'mcq' ? (
          <MCQQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSubmit}
          />
        ) : (
          <ProgrammingQuestion
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
          />
        )}
        
        <QuizNavigation
          currentIndex={currentQuestionIndex}
          onNext={nextQuestion}
          onPrevious={previousQuestion}
          onFinish={handleFinish}
        />
      </div>
    </div>
  );
}