import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '../types/quiz';

interface QuestionStore {
  questionPapers: {
    id: string;
    title: string;
    questions: Question[];
    createdAt: Date;
  }[];
  addQuestionPaper: (title: string, questions: Question[]) => string;
  getQuestionPaper: (id: string) => { title: string; questions: Question[] } | null;
  deleteQuestionPaper: (id: string) => void;
}

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      questionPapers: [],
      
      addQuestionPaper: (title, questions) => {
        const id = Date.now().toString();
        set((state) => ({
          questionPapers: [
            ...state.questionPapers,
            { id, title, questions, createdAt: new Date() }
          ]
        }));
        return id;
      },
      
      getQuestionPaper: (id) => {
        const paper = get().questionPapers.find(p => p.id === id);
        return paper ? { title: paper.title, questions: paper.questions } : null;
      },
      
      deleteQuestionPaper: (id) => {
        set((state) => ({
          questionPapers: state.questionPapers.filter(p => p.id !== id)
        }));
      }
    }),
    {
      name: 'question-papers'
    }
  )
);