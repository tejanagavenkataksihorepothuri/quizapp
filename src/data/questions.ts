import { Question } from '../types/quiz';

export const defaultQuestions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the output of console.log(typeof typeof 1)?',
    options: ['number', 'string', 'undefined', 'object'],
    correctAnswer: 'string',
    points: 10
  },
  {
    id: 2,
    type: 'programming',
    question: 'Write a function that returns the factorial of a given number.',
    initialCode: 'function factorial(n) {\n  // Your code here\n}',
    testCases: [
      { input: '5', expectedOutput: '120' },
      { input: '0', expectedOutput: '1' },
      { input: '3', expectedOutput: '6' }
    ],
    points: 20
  }
];