import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { QuizState, Question, QuizSession, Participant, ProgrammingLanguage } from '../types/quiz';

interface QuizStore extends QuizState {
  setAnswer: (questionId: number, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  startQuiz: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  createQuizSession: (name: string, questions: Question[]) => QuizSession;
  joinQuizSession: (joinCode: string, participantName: string) => Participant | null;
  startQuizSession: (quizId: string) => void;
  endQuizSession: (quizId: string) => void;
  submitQuizAnswer: (participantId: string, questionId: number, answer: string) => void;
  getQuizSession: (joinCode: string) => QuizSession | null;
  getParticipantsByQuiz: (quizId: string) => Participant[];
  setParticipantLanguage: (participantId: string, language: ProgrammingLanguage) => void;
  getAllQuestions: () => Question[];
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      customQuestions: [],
      activeQuizzes: [],
      participants: [],
      
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer }
        })),
        
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            get().getAllQuestions().length - 1
          )
        })),
        
      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
        })),
        
      startQuiz: () =>
        set({
          currentQuestionIndex: 0,
          answers: {},
          score: 0,
          timeStarted: new Date()
        }),
        
      endQuiz: () =>
        set({
          timeEnded: new Date()
        }),
        
      resetQuiz: () =>
        set({
          currentQuestionIndex: 0,
          answers: {},
          score: 0,
          timeStarted: undefined,
          timeEnded: undefined
        }),

      createQuizSession: (name, questions) => {
        const session: QuizSession = {
          id: nanoid(),
          joinCode: nanoid(6).toUpperCase(),
          name,
          questions,
          status: 'waiting',
          createdAt: new Date(),
        };

        set((state) => ({
          activeQuizzes: [...state.activeQuizzes, session]
        }));

        return session;
      },

      joinQuizSession: (joinCode, participantName) => {
        const session = get().activeQuizzes.find(q => q.joinCode === joinCode);
        if (!session || session.status !== 'waiting') return null;

        const participant: Participant = {
          id: nanoid(),
          name: participantName,
          quizId: session.id,
          score: 0,
          answers: {},
          selectedLanguage: 'javascript'
        };

        set((state) => ({
          participants: [...state.participants, participant]
        }));

        return participant;
      },

      startQuizSession: (quizId) => {
        set((state) => ({
          activeQuizzes: state.activeQuizzes.map(q =>
            q.id === quizId ? { ...q, status: 'active' } : q
          )
        }));
      },

      endQuizSession: (quizId) => {
        set((state) => ({
          activeQuizzes: state.activeQuizzes.map(q =>
            q.id === quizId ? { ...q, status: 'completed' } : q
          )
        }));
      },

      submitQuizAnswer: (participantId, questionId, answer) => {
        set((state) => ({
          participants: state.participants.map(p =>
            p.id === participantId
              ? {
                  ...p,
                  answers: { ...p.answers, [questionId]: answer },
                  score: calculateScore(p, answer, questionId, state.activeQuizzes)
                }
              : p
          )
        }));
      },

      getQuizSession: (joinCode) => {
        return get().activeQuizzes.find(q => q.joinCode === joinCode) || null;
      },

      getParticipantsByQuiz: (quizId) => {
        return get().participants.filter(p => p.quizId === quizId);
      },

      setParticipantLanguage: (participantId, language) => {
        set((state) => ({
          participants: state.participants.map(p =>
            p.id === participantId
              ? { ...p, selectedLanguage: language }
              : p
          )
        }));
      },

      getAllQuestions: () => {
        const activeQuiz = get().activeQuizzes[0];
        return activeQuiz ? activeQuiz.questions : [];
      }
    }),
    {
      name: 'quiz-store'
    }
  )
);

function calculateScore(
  participant: Participant,
  newAnswer: string,
  questionId: number,
  quizzes: QuizSession[]
): number {
  const quiz = quizzes.find(q => q.id === participant.quizId);
  if (!quiz) return participant.score;

  const question = quiz.questions.find(q => q.id === questionId);
  if (!question) return participant.score;

  let score = participant.score;

  switch (question.type) {
    case 'mcq':
      if (question.correctAnswer === newAnswer) {
        score += question.points;
      }
      break;
    case 'fillInBlank':
      if (Array.isArray(newAnswer) && question.blankAnswers) {
        const correctAnswers = newAnswer.filter((ans, index) => 
          ans.toLowerCase() === question.blankAnswers![index].toLowerCase()
        );
        score += (correctAnswers.length / question.blankAnswers.length) * question.points;
      }
      break;
    case 'matching':
      if (Array.isArray(newAnswer) && question.matchingPairs) {
        const correctMatches = newAnswer.filter(match => {
          const [left, right] = match.split(':');
          return question.matchingPairs!.some(pair => 
            pair.left === left && pair.right === right
          );
        });
        score += (correctMatches.length / question.matchingPairs.length) * question.points;
      }
      break;
  }
  
  return score;
}