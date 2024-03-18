import fs from 'fs';
export enum colours {red, blue, green, yellow, purple, brown, orange}

export type quizAnswer = {
  answerId: number,
  answer: string,
  colour?: string,
  correct?: boolean,
}

export type quizQuestion = {
  questionId: number,
  question: string,
  duration: number,
  points: number,
  answers: quizAnswer[],
  thumbnailUrl?: string,
}

export type quizCopy = {
  authUserId: number,
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  questions: quizQuestion[],
  numQuestions?: number,
  thumbnailUrl?: string,
}

export type message = {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number,
}

export type correctBreakdown = {
  answerIds: number[],
  playersCorrect: string[]
}

export type playerSubmit = {
  playerId: number,
  answersSubmitted: number[],
  timeSubmitted: number,
  numCorrectAnswers?: number
}

export type questiondata = {
  questionId: number,
  submittedAnswers: playerSubmit[],
  questionStartTime: number,
  questionCorrectBreakdown: correctBreakdown,
  averageAnswerTime: number,
  percentCorrect: number
}

export type player = {
  playerId: number,
  name: string,
  answerTime: number,
}

export type rank = {
  name: string,
  score: number
}

export type session = {
  sessionId: number,
  quizId: number,
  state: string,
  autoStartNum: number,
  atQuestion: number,
  numQuestions: number,
  players: player[],
  metadata: quizCopy,
  messages: message[],
  sessiondata: questiondata[],
  userRanks: rank[]
}

export type incorrectBreakdown = {
  answerId: number,
  playersInc: player[]
}

export type quiz = {
  authUserId: number,
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  questions: quizQuestion[],
  thumbnailUrl?: string,
  activeSessions?: number[],
  inactiveSessions?: number[],
  duration: number
}

export type user = {
  userId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  currentPassword: string,
  usedPasswords: string[],
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  tokens: string[],
  trash: quiz[],
}

export interface DataStore {
  users: user[],
  quizzes: quiz[],
  sessions: session[],
  isTimerRunning?: boolean,
}

export let data: DataStore = {
  users: [],
  quizzes: [],
  sessions: [],
  isTimerRunning: false,
};

export let timerIds: any[] = [];

export const getTimers = (): any[] => {
  return timerIds;
};

export const setTimers = (newIds: any[]) => {
  timerIds = newIds;
};
// Use get() to access the data
export const getData = (): DataStore => {
  return data;
};

// Use set(newData) to pass in the entire data object, with modifications made
export const setData = (newData: DataStore) => {
  data = newData;
  saveDataFile();
};

// These two functions are used to implement data persistence.
// Read in database stored as JSON string from data.json.
export const readDataFile = () => {
  const dataStream: string = fs.readFileSync('data.json');
  setData(JSON.parse(dataStream));
};

// Save data into database and convert it into JSON string and write it to data.json file.
export const saveDataFile = () => fs.writeFileSync('data.json', JSON.stringify(getData()));
