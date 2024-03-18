import { quizQuestion } from './dataStore';

export type addAnswer = {
  answer: string,
  correct: boolean
}

export type adminQuizInfoReturn = {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: quizQuestion[],
  duration: number,
  thumbnailUrl?: string
}
