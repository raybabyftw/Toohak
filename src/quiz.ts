// Imported files
import { getData, setData, DataStore, colours, quiz, session, quizAnswer } from './dataStore';
import { checkValidToken, findUserFromUserId, validStringCheck } from './helper';
import HTTPError from 'http-errors';
import request from 'sync-request';
import { port, url } from './config.json';
import fs from 'fs';
import isUrl from 'is-url';

// Importe types for typesafety
import { adminQuizInfoReturn } from './typesafety';

const SERVER_URL = `${url}:${port}/`;

const insufficientLength = { error: 'Provide a name beteen 3 and 30 characters in length.' };
const nonAlphanumericName = { error: 'Do not add non-alphanumeric characters to the name.' };
const incorrectOwner = { error: 'Quiz Id does not belong to current user' };
const descriptionLengthError = { error: 'Quiz description must not exceed 100 characters.' };
const nameInUseByLoggedInUser = { error: 'Name is already used by the current logged in user for another quiz' };
const quizIdNotInTrash = { error: 'Quiz ID refers to a quiz that is not currently in the trash' };
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HTTP_FAILED = 400;

/**
  * Given basic details about a new quiz, create one for the logged in user
  * @param { string } token
  * @param { string } name
  * @param { string } description
  * @returns { number } quizId
*/
export function adminQuizCreate(token: string, name: string, description: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  if (name.length < 3 || name.length > 30) {
    throw HTTPError(400, insufficientLength);
  } else if (!validStringCheck(name)) {
    throw HTTPError(400, nonAlphanumericName);
  } else if (checkDuplicateQuiz(dataStore, authUserId, name) === true) {
    throw HTTPError(400, nameInUseByLoggedInUser);
  }

  if (description.length > 100) {
    throw HTTPError(400, descriptionLengthError);
  }

  const timeCreated = Date.now() / 1000;
  const uniqueQuizId = dataStore.quizzes.length + 1;

  const quiz: quiz = {
    authUserId: authUserId,
    quizId: uniqueQuizId,
    name: name,
    timeCreated: timeCreated,
    timeLastEdited: timeCreated,
    description: description,
    questions: [],
    thumbnailUrl: '',
    activeSessions: [],
    inactiveSessions: [],
    duration: 0
  };

  dataStore.quizzes.push(quiz);
  setData(dataStore);

  return {
    quizId: quiz.quizId
  };
}

/**
  * Given basic details about a new quiz, create one for the logged in user
  * @param { string } token
  * @param { number } quizId
  * @returns { object } empty quiz
*/
export function adminQuizRemove(token: string, quizId: number) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  let quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, { error: `user ${quizId} doesn't exist` });
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, incorrectOwner);
  }

  quiz.timeLastEdited = Date.now() / 1000;
  const quizTarget = dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId);
  const userTarget = dataStore.users.findIndex(user => user.userId === authUserId);
  dataStore.users[userTarget].trash.push(quiz);

  // Delete all information about the quiz from dataStore.quizzes besides quizId
  quiz = {
    quizId: quizId,
    authUserId: authUserId
  };

  dataStore.quizzes[quizTarget] = quiz;

  setData(dataStore);
  return {};
}

/**
  * Function gets all of the relevant information about the current quiz
  * @param { string } token
  * @param { number } quizId
  * @returns { object }body containing relevant quiz information
*/
export function adminQuizInfo (token: string, quizId: number, version?: number) {
  const dataStore = getData();

  const authUserId = checkValidToken(token);

  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(HTTP_FAILED, 'user id does not exist');
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(HTTP_FAILED, 'Quiz Id does not belong to current user');
  }

  const duplicateQuiz = {} as adminQuizInfoReturn;

  if (version === 1) {
    for (const question of quiz.questions) {
      if (question.thumbnailUrl !== undefined) {
        delete question.thumbnailUrl;
      }
    }
  } else {
    duplicateQuiz.thumbnailUrl = quiz.thumbnailUrl;
  }

  duplicateQuiz.quizId = quiz.quizId;
  duplicateQuiz.name = quiz.name;
  duplicateQuiz.timeCreated = quiz.timeCreated;
  duplicateQuiz.timeLastEdited = quiz.timeLastEdited;
  duplicateQuiz.description = quiz.description;
  duplicateQuiz.numQuestions = quiz.questions.length;
  duplicateQuiz.questions = quiz.questions;
  duplicateQuiz.duration = quiz.duration;
  return duplicateQuiz;
}

/**
  * Update the name of the relevant quiz
  * @param { string } token
  * @param { number } quizId
  * @param { string } name
  * @returns { object } empty object
*/
export function adminQuizNameUpdate (token: string, quizId: number, name: string) {
  const dataStore = getData();

  const authUserId = checkValidToken(token);
  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (!validStringCheck(name)) {
    throw HTTPError(400, 'Do not add non-alphanumeric characters to the name.');
  } else if (name.length < 3 || name.length > 30) {
    throw HTTPError(400, 'Provide a name beteen 3 and 30 characters in length.');
  } else if (checkDuplicateQuiz(dataStore, authUserId, name) === true) {
    throw HTTPError(400, 'Name is already used by the current logged in user for another quiz');
  }

  quiz.name = name;
  quiz.timeLastEdited = Date.now() / 1000;

  setData(dataStore);

  return {};
}

/**
  * Update the description of the revelant quiz
  * @param { string } token
  * @param { number } quizId
  * @param { string } description
  * @returns { object } empty object
*/
export function adminQuizDescriptionUpdate (token: string, quizId: number, description: string) {
  const dataStore = getData();

  const authUserId = checkValidToken(token);
  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (description.length > 100) {
    throw HTTPError(400, 'Quiz description must not exceed 100 characters.');
  }

  quiz.description = description;
  quiz.timeLastEdited = Date.now() / 1000;

  setData(dataStore);
  return {};
}

/**
  * Provides a list of all quizzes that are owned by the currently logged in user
  * @param { string } token
  * @returns { Array<{ quizId: number, name: string }> }
*/
export function adminQuizList(token: string) {
  const dataStore = getData();

  const authUserId = checkValidToken(token);

  // If no quizzes exist
  if (dataStore.quizzes.length === 0) {
    return { quizzes: [] };
  }
  const userQuizzes = [];
  for (const quiz of dataStore.quizzes) {
    if (quiz.authUserId === authUserId && quiz.name !== undefined) {
      userQuizzes.push({ quizId: quiz.quizId, name: quiz.name });
    }
  }
  return { quizzes: userQuizzes };
}

/**
  * Transfer ownership of a quiz to a different user based on their email
  * @param { string } token
  * @param { string } userEmail
  * @param { number } quizId
  * @returns { object } empty object
*/
export function adminQuizTransfer(quizId: number, token: string, userEmail: string) {
  const dataStore = getData();

  const authUserId = checkValidToken(token);

  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (!checkEmailExists(dataStore, userEmail)) {
    throw HTTPError(400, 'Email does not correspond to a real user');
  } else if (checkValidToken(token) === checkEmailExists(dataStore, userEmail)) {
    throw HTTPError(400, 'Email is the current logged in user');
  }

  const userIdReceiver = checkEmailExists(dataStore, userEmail);

  const quizName = quiz.name;
  if (checkDuplicateQuiz(dataStore, userIdReceiver, quizName) === true) {
    throw HTTPError(400, 'Name is already in use by target user');
  }

  for (const quizElement of dataStore.quizzes) {
    if (quizElement.quizId === quizId) {
      quizElement.authUserId = userIdReceiver;
      quizElement.timeLastEdited = Date.now() / 1000;
      setData(dataStore);
    }
  }

  return {};
}

/**
  * Create a new stub question for a particular quiz
  * @param { string } token
  * @param { string } questionId
  * @param { number } quizId
  * @param { string } question
  * @param { number } points
  * @param { number } answers
  * @returns { Array<{ questionId: number }> }
*/
export function adminCreateQuestion(quizId: number, token: string, question: string, duration: number, points: number, answers: quizAnswer[], thumbnailUrl?: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);
  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (question.length < 5 || question.length > 50) {
    throw HTTPError(400, 'Question length must be between 5 and 50 characters');
  } else if (answers.length < 2 || answers.length > 6) {
    throw HTTPError(400, 'The number of answers must be between 2 and 6');
  } else if (duration <= 0) {
    throw HTTPError(400, 'The duration of the question must be a positive number');
  } else if ((totalDuration(quiz) + duration) > 180) {
    throw HTTPError(400, 'You have exceeded the total duration allowed for the quiz');
  } else if (points < 1 || points > 10) {
    throw HTTPError(400, 'You must award between 1 and 10 points for the question');
  } else if (!validAnswerLength(answers)) {
    throw HTTPError(400, 'All answers must be between 1 and 30 characters');
  } else if (hasDuplicates(answers)) {
    throw HTTPError(400, 'Cannot have duplicate answers');
  } else if (!includesCorrectAnswer(answers)) {
    throw HTTPError(400, 'You must include a correct answer');
  }
  const rn = require('random-number');
  const options = {
    min: 1,
    max: 7,
    integer: true
  };

  let uniqueAnswerId = 0;
  for (const element of answers) {
    Object.assign(element, { answerId: uniqueAnswerId });
    Object.assign(element, { colour: colours[rn(options) % 7] });
    uniqueAnswerId++;
  }

  const uniqueQuestionId = rn() + 1;

  if (thumbnailUrl === undefined) {
    quiz.questions.push(
      {
        questionId: uniqueQuestionId,
        question: question,
        duration: duration,
        points: points,
        answers: answers,
        thumbnailUrl: ''
      }
    );
    quiz.timeLastEdited = Date.now() / 1000;
    quiz.duration = totalDuration(quiz);

    setData(dataStore);
    return { questionId: uniqueQuestionId };
  }

  const generatedUrl = checkValidImage(thumbnailUrl);
  quiz.questions.push(
    {
      questionId: uniqueQuestionId,
      question: question,
      duration: duration,
      points: points,
      answers: answers,
      thumbnailUrl: generatedUrl
    }
  );
  quiz.timeLastEdited = Date.now() / 1000;
  quiz.duration = totalDuration(quiz);

  setData(dataStore);
  return { questionId: uniqueQuestionId };
}

export const adminUpdateQuestion = (quizId: number, questionId: number, token: string, question: string, duration: number, points: number, answers: quizAnswer[], thumbnailUrl?: string) => {
  const dataStore = getData();
  const quiz = checkQuizId(dataStore, quizId);
  const authUserId = checkValidToken(token);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (questIdExistsInQuiz(dataStore, quizId, questionId) === false) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  } else if (question.length < 5 || question.length > 50) {
    throw HTTPError(400, 'Question length must be between 5 and 50 characters');
  } else if (answers.length < 2 || answers.length > 6) {
    throw HTTPError(400, 'The number of answers must be between 2 and 6');
  } else if (duration <= 0) {
    throw HTTPError(400, 'The duration of the question must be a positive number');
  } else if ((totalDuration(quiz) + duration) > 180) {
    throw HTTPError(400, 'You have exceeded the total duration allowed for the quiz');
  } else if (points < 1 || points > 10) {
    throw HTTPError(400, 'You must award between 1 and 10 points for the question');
  } else if (!validAnswerLength(answers)) {
    throw HTTPError(400, 'All answers must be between 1 and 30 characters');
  } else if (hasDuplicates(answers)) {
    throw HTTPError(400, 'Cannot have duplicate answers');
  } else if (!includesCorrectAnswer(answers)) {
    throw HTTPError(400, 'You must include a correct answer');
  }

  const generatedUrl = checkValidImage(thumbnailUrl);

  quiz.timeLastEdited = Date.now() / 1000;

  const rn = require('random-number');

  for (const element of answers) {
    const uniqueAnswerId = rn();
    Object.assign(element, { answerId: uniqueAnswerId });
    const options = {
      min: 1,
      max: 7,
      integer: true
    };
    Object.assign(element, { colour: colours[rn(options) % 7] });
  }

  for (const element of quiz.questions) {
    if (element.questionId === questionId) {
      element.question = question;
      element.duration = duration;
      element.points = points;
      element.answers = answers;
      for (const answerElement of element.answers) {
        const uniqueAnswerId = rn();
        Object.assign(answerElement, { answerId: uniqueAnswerId });
        const options = {
          min: 1,
          max: 7,
          integer: true
        };
        Object.assign(answerElement, { colour: colours[rn(options) % 7] });
      }

      element.thumbnailUrl = generatedUrl;
    }
  }
  quiz.duration = totalDuration(quiz);
  setData(dataStore);
  return {};
};

export const adminDeleteQuestion = (quizId: number, questionId: number, token: string) => {
  const dataStore = getData();
  const quiz = checkQuizId(dataStore, quizId);

  const authUserId = checkValidToken(token);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (questIdExistsInQuiz(dataStore, quizId, questionId) === false) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  quiz.timeLastEdited = Date.now() / 1000;

  const index = quiz.questions.findIndex(element => element.questionId === questionId);
  quiz.questions.splice(index, 1);
  quiz.duration = totalDuration(quiz);

  setData(dataStore);
  return {};
};

/**
  * View the quizzes that are currently in the trash
  * @param { string } token
  * @returns { Array<{ quizId: number, name: string }> }
*/
export function adminQuizTrashList(token: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  if (dataStore.users[0].trash.length === 0) {
    return { quizzes: [] };
  }

  const userQuizzes = [];
  const userTarget = dataStore.users.findIndex(user => user.userId === authUserId);

  for (const quiz of dataStore.users[userTarget].trash) {
    userQuizzes.push({ quizId: quiz.quizId, name: quiz.name });
  }

  return { quizzes: userQuizzes };
}

/**
  * Move a question from one particular position in the quiz to another
  * @param { string } token
  * @param { number } quizId
  * @param { number } questionId
  * @param { number } newPosition
  * @returns { object } empty object
*/
export function adminMoveQuestion(token: string, quizId: number, questionId: number, newPosition: number) {
  const dataStore = getData();
  const quiz = checkQuizId(dataStore, quizId);

  const authUserId = checkValidToken(token);

  if (quiz === undefined) {
    throw HTTPError(400, `quizId ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (questIdExistsInQuiz(dataStore, quizId, questionId) === false) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  // NewPosition is less than 0
  if (newPosition < 0) {
    throw HTTPError(HTTP_FAILED, 'new position is less than 0');
  }

  // NewPosition is greater than n-1 where n is the number of questions
  const numQuestions = quiz.questions.length;
  if (newPosition > (numQuestions - 1)) {
    throw HTTPError(HTTP_FAILED, 'new position is greater than the number of questions');
  }

  // NewPosition is the position of the current question
  const fromIndex = quiz.questions.findIndex(element => element.questionId === questionId);
  if (newPosition === fromIndex) {
    throw HTTPError(HTTP_FAILED, 'new position is the current position');
  }

  // update timeLastEdited
  quiz.timeLastEdited = Date.now() / 1000;
  setData(dataStore);

  // find the question object to move
  const question = questionObj(quiz, questionId);

  // move question
  quiz.questions.splice(fromIndex, 1);
  quiz.questions.splice(newPosition, 0, question);

  return {};
}

/**
  * Restores a given quiz from the user's trash
  * @param { string } token
  * @param { number } quizId
  * @returns {}
*/
export function adminQuizRestore(quizId: number, token: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  // Check if quiz exists
  const quiz = checkQuizId(dataStore, quizId);
  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  }

  // Find the index of the user with the given token
  const userIndex = dataStore.users.findIndex(element => element.userId === authUserId);
  // Find the index of the quiz within quizzes array
  const quizIndex = dataStore.quizzes.findIndex(element => element.quizId === quizId);
  // Find the index of the quiz within the user's trash array
  const quizTrashIndex = dataStore.users[userIndex].trash.findIndex(element => element.quizId === quizId);

  if (quizTrashIndex === -1) {
    throw HTTPError(400, quizIdNotInTrash);
  }

  const removedQuiz = dataStore.users[userIndex].trash.splice(quizTrashIndex, 1)[0];
  dataStore.quizzes[quizIndex] = removedQuiz;

  setData(dataStore);
  return {};
}

/**
  * Move a question from one particular position in the quiz to another
  * @param { string } token
  * @param { number } quizId
  * @param { number } questionId
  * @returns { object } newQuestionId
*/
export function adminDuplicateQuestion(token: string, quizId: number, questionId: number) {
  const dataStore = getData();
  const quiz = checkQuizId(dataStore, quizId);
  const authUserId = checkValidToken(token);

  if (quiz === undefined) {
    throw HTTPError(400, `quizId ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (questIdExistsInQuiz(dataStore, quizId, questionId) === false) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  quiz.timeLastEdited = Date.now() / 1000;

  // duplicate question
  const sourceQuestion = questionObj(quiz, questionId);
  const duplicateQuestion = { ...sourceQuestion };

  // change question id using identifier
  const rn = require('random-number');
  const newQuestionId = rn() + 1;
  duplicateQuestion.questionId = newQuestionId;

  const fromIndex = quiz.questions.findIndex(element => element.questionId === questionId);
  quiz.questions.splice(fromIndex + 1, 0, duplicateQuestion);
  quiz.duration = totalDuration(quiz);

  setData(dataStore);
  return { newQuestionId: newQuestionId };
}

export function adminTrashEmpty(token: string, quizIds: number[]) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);
  const trash = findUserFromUserId(authUserId).trash;
  for (const quizId of quizIds) {
    const quiz = checkQuizId(dataStore, quizId);
    if (quiz === undefined) {
      throw HTTPError(400, `quizId ${quizId} doesn't exist`);
    } else if (quiz.authUserId !== authUserId) {
      throw HTTPError(400, 'One of more of the QuizId\'s does not belong to current user');
    } else if (trash.find(element => element.quizId === quizId) === undefined) {
      throw HTTPError(400, 'One or more of the Quiz IDs is not currently in the trash');
    }
  }
  for (const quizId of quizIds) {
    const index = trash.findIndex(element => element.quizId === quizId);
    trash.splice(index, 1);
  }

  setData(dataStore);
  return {};
}

export const updateQuizThumbnail = (quizId: number, token: string, thumbnailUrl: string) => {
  const dataStore = getData();
  const quiz = checkQuizId(dataStore, quizId);
  const authUserId = checkValidToken(token);

  if (quiz === undefined) {
    throw HTTPError(400, `user ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  }

  quiz.thumbnailUrl = checkValidImage(thumbnailUrl);

  setData(dataStore);
  return {};
};

export function adminSessionStart(quizId: number, token: string, autoStartNum: number) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);
  const quiz = checkQuizId(dataStore, quizId);

  if (dataStore.sessions === undefined) {
    dataStore.sessions = [];
  }

  if (quiz === undefined) {
    throw HTTPError(400, `Quiz ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (autoStartNum > 50) {
    throw HTTPError(400, 'Enter an auto start number less than 50');
  } else if (quiz.activeSessions.length >= 10) {
    throw HTTPError(400, 'The maximum number of concurrent sessions for this quiz has been reached. Please wait until another session has ended.');
  } else if (quiz.questions.length === 0) {
    throw HTTPError(400, 'There are no questions in the current quiz.');
  }

  const rn = require('random-number');
  const uniqueSessionId = rn() + 1;

  const quizCopy: quiz = JSON.parse(JSON.stringify(quiz));
  delete quizCopy.activeSessions;
  delete quizCopy.inactiveSessions;

  quiz.activeSessions.push(uniqueSessionId);

  const object: session = {
    sessionId: uniqueSessionId,
    quizId: quizId,
    state: 'LOBBY',
    autoStartNum: autoStartNum,
    atQuestion: 0,
    numQuestions: quizCopy.questions.length,
    players: [],
    metadata: quizCopy,
    messages: [],
    sessiondata: [],
    userRanks: [],
  };

  dataStore.sessions.push(object);

  setData(dataStore);

  return { sessionId: uniqueSessionId };
}

//= =================================================//
/**
 * Helper Functions
 */
//= =================================================//

// Helper function checks if a user's email exists
export function checkEmailExists(dataStore: DataStore, email: string): boolean | number {
  for (const user of dataStore.users) {
    if (email.toLocaleLowerCase() === user.email) {
      return user.userId;
    }
  }

  return false;
}

// Helper function calculates the sum of a quiz's duration
export const totalDuration = (quiz: quiz): number => {
  if (quiz.questions.length === 0) {
    return 0;
  }

  const duration = quiz.questions.map(element => element.duration);
  return duration.reduce((a, b) => a + b);
};

// Helper function checks if answer length is valid
const validAnswerLength = (answers: quizAnswer[]): boolean => {
  return answers.every(element => element.answer.length >= 1 && element.answer.length <= 30);
};

// Helper function checks if answers array has duplicate answers
const hasDuplicates = (answers: quizAnswer[]): boolean => {
  const set = new Set(answers.map(element => element.answer));
  return set.size !== answers.length;
};

// Helper function checks if answers array contains a correct answer
const includesCorrectAnswer = (answer: quizAnswer[]): boolean => answer.some(item => item.correct === true);

// Helper function checks if quiz exists
export const checkQuizId = (dataStore: DataStore, quizId: number) => {
  const quiz = dataStore.quizzes;
  return quiz.find(element => element.quizId === quizId);
};

// Helper function checks if a quiz name under a specific user already exists
const checkDuplicateQuiz = (dataStore: DataStore, authUserId: number, name: string) => {
  return dataStore.quizzes.some(quizElement =>
    quizElement.authUserId === authUserId && name.localeCompare(quizElement.name) === 0
  );
};

// Helper function returns a question object containing questionId
const questionObj = (quiz: quiz, questionId: number) => quiz.questions.find(element => element.questionId === questionId);

// Helper function checks if questionId refers to a valid question in a quiz
const questIdExistsInQuiz = (dataStore: DataStore, quizId: number, questionId: number) => {
  return dataStore.quizzes.some(quiz => {
    if (quiz.quizId === quizId) {
      return quiz.questions.some(question => question.questionId === questionId);
    }
    return false;
  });
};

function generateString(length: number) {
  let result = '';
  const charactersLength = CHARACTERS.length;
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function checkValidImage(thumbnailUrl: string) {
  if (thumbnailUrl.length === 0) {
    throw HTTPError(400, 'The thumbnailUrl is an empty string');
  } else if (isUrl(thumbnailUrl) === false) {
    throw HTTPError(400, 'The thumbnailUrl is invalid');
  }

  const res = request('GET', thumbnailUrl);
  const filename = `thumbnails/${generateString(10)}image${generateString(5)}.jpg`;

  if (res.statusCode !== 200) {
    throw HTTPError(400, `The url returns code ${res.statusCode}`);
  }
  fs.writeFileSync(filename, res.getBody(), { flag: 'w' });
  const generatedUrl = SERVER_URL + filename;
  const data = fs.readFileSync(filename);

  // Check for PNG and JPG signature
  if (
    !(
      (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47 &&
      data[4] === 0x0D && data[5] === 0x0A && data[6] === 0x1A && data[7] === 0x0A) ||
      (data[0] === 0xFF && data[1] === 0xD8 && data[data.length - 2] === 0xFF && data[data.length - 1] === 0xD9)
    )
  ) {
    fs.unlinkSync(filename);
    throw HTTPError(400, 'The image must be a PNG or JPEG');
  } else {
    return generatedUrl;
  }
}
