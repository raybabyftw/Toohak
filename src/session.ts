// Imported files
import { getData, setData, getTimers, setTimers, DataStore, questiondata } from './dataStore';
import { checkValidToken, findAnswersFromQuestionId, findPlayerfromPlayerId, findSessionFromPlayerId } from './helper';
import { questionOpen } from './player';
import HTTPError from 'http-errors';

const COUNTDOWN_TIME = 0.1 * 1000;

export function adminSessionUpdate(quizId: number, sessionId: number, token: string, action: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);
  const session = checkSessionId(dataStore, sessionId);
  const quiz = checkQuizId(dataStore, quizId);

  if (quiz === undefined) {
    throw HTTPError(400, `Quiz ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  } else if (session === undefined) {
    throw HTTPError(400, `Session ${sessionId} doesn't exist`);
  } else if (!isEnum(action)) {
    throw HTTPError(400, 'Action provided is not a valid Action.');
  }

  if (action === 'END') {
    const sessionIndex = quiz.activeSessions.findIndex(element => element === sessionId);
    quiz.activeSessions.splice(sessionIndex, 1);
    quiz.inactiveSessions.push(sessionId);
    session.state = 'END';

    setData(dataStore);
    return {};
  }

  if (dataStore.isTimerRunning) {
    throw HTTPError(400, 'This action cannot be applied in the current state.');
  }

  if (session.state === 'LOBBY' && action === 'NEXT_QUESTION') {
    session.state = 'QUESTION_COUNTDOWN';
    setData(dataStore);
    const timers = getTimers();
    const timerId = setTimeout(() => questionOpen(session, dataStore), COUNTDOWN_TIME);

    timers.push(timerId);
    setTimers(timers);
    dataStore.isTimerRunning = true;

    setData(dataStore);
    return {};
  } else if (session.state === 'LOBBY') {
    throw HTTPError(400, 'This action cannot be applied in the current state.');
  }

  if (session.state === 'QUESTION_OPEN' && action === 'GO_TO_ANSWER') {
    session.state = 'ANSWER_SHOW';
    setData(dataStore);
    return {};
  } else if (session.state === 'QUESTION_OPEN') {
    throw HTTPError(400, 'This action cannot be applied in the current state.');
  }

  if (session.state === 'QUESTION_CLOSE' && action === 'NEXT_QUESTION') {
    session.state = 'QUESTION_COUNTDOWN';
    setData(dataStore);

    const timers = getTimers();
    const timerId = setTimeout(() => questionOpen(session, dataStore), COUNTDOWN_TIME);
    timers.push(timerId);
    setTimers(timers);
    dataStore.isTimerRunning = true;

    setData(dataStore);
    return {};
  } else if (session.state === 'QUESTION_CLOSE' && action === 'GO_TO_ANSWER') {
    session.state = 'ANSWER_SHOW';
    setData(dataStore);
    return {};
  } else if (session.state === 'QUESTION_CLOSE' && action === 'GO_TO_FINAL_RESULTS') {
    session.state = 'FINAL_RESULTS';
    setData(dataStore);
    return {};
  }

  if (session.state === 'ANSWER_SHOW' && action === 'NEXT_QUESTION') {
    session.state = 'QUESTION_COUNTDOWN';
    setData(dataStore);

    const timers = getTimers();
    const timerId = setTimeout(() => questionOpen(session, dataStore), COUNTDOWN_TIME);
    timers.push(timerId);
    setTimers(timers);
    dataStore.isTimerRunning = true;

    setData(dataStore);
    return {};
  } else if (session.state === 'ANSWER_SHOW' && action === 'GO_TO_FINAL_RESULTS') {
    session.state = 'FINAL_RESULTS';
    setData(dataStore);
    return {};
  } else if (session.state === 'ANSWER_SHOW') {
    throw HTTPError(400, 'This action cannot be applied in the current state.');
  }

  setData(dataStore);
  return {};
}

export const getSessionStatus = (quizId: number, sessionId: number, token: string) => {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  const quiz = checkQuizId(dataStore, quizId);
  if (quiz === undefined) {
    throw HTTPError(400, `Quiz ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  }

  const session = checkSessionId(dataStore, sessionId);
  if (session === undefined) {
    throw HTTPError(400, `Session ${sessionId} doesn't exist`);
  }

  const metadataEdit = session.metadata;
  delete metadataEdit.authUserId;
  metadataEdit.numQuestions = metadataEdit.questions.length;

  const participants: string[] = [];

  for (const player of session.players) {
    participants.push(player.name);
  }

  const status = {
    state: session.state,
    atQuestion: session.atQuestion,
    players: participants,
    metadata: session.metadata,
  };
  return status;
};

export function adminViewSessions (quizId: number, token: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  const quiz = checkQuizId(dataStore, quizId);
  if (quiz === undefined) {
    throw HTTPError(400, `Quiz ${quizId} doesn't exist`);
  } else if (quiz.authUserId !== authUserId) {
    throw HTTPError(400, 'Quiz Id does not belong to current user');
  }

  // Reorder in ascending order
  const activeSessions = quiz.activeSessions.slice().sort((a, b) => a - b);
  const inactiveSessions = quiz.inactiveSessions.slice().sort((a, b) => a - b);

  setData(dataStore);
  return {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions
  };
}

/**
  *
  * @param { number } playerId
  * @param { number } questionPosition
  * @returns { quizQuestionResultsReturn }
*/
export function questionResults(playerId: number, questionPosition: number) { // qPos starts from 1
  const dataStore = getData();
  const sessionObj = findSessionFromPlayerId(playerId, dataStore); // returns the session given a playerId

  const numQuestions = sessionObj.metadata.questions.length;
  if (questionPosition > numQuestions || questionPosition < 0) {
    throw HTTPError(400, 'Player position is invalid for session player is in');
  } else if (sessionObj.state !== 'ANSWER_SHOW') {
    throw HTTPError(400, 'Session is not in ANSWER_SHOW state');
  } else if (questionPosition > sessionObj.atQuestion) {
    throw HTTPError(400, `Session is not yet up to question ${questionPosition}`);
  }
  const question: questiondata = sessionObj.sessiondata[questionPosition - 1];
  const questionId = question.questionId; // returns questionId
  const correctAnswerIds = findAnswersFromQuestionId(sessionObj, question.questionId).reduce(
    (array, item) => {
      if (item.correct) {
        array.push(item.answerId);
      }
      return array;
    },
    []); // finds the correct answers for a question and filters them into an array of numbers with only correct answerId's
  const playerAnswerSubmissions = sessionObj.sessiondata[questionPosition - 1].submittedAnswers;

  // for each correct answer, checks which player got that answer correct
  const questionBreakdown = [];
  for (const correctAnswer of correctAnswerIds) {
    const playersCorrect: string[] = [];
    for (const individualPlayerSubmission of playerAnswerSubmissions) {
      if (individualPlayerSubmission.answersSubmitted.includes(correctAnswer)) {
        const name = findPlayerfromPlayerId(sessionObj, individualPlayerSubmission.playerId).name;
        playersCorrect.push(name);
        individualPlayerSubmission.numCorrectAnswers++;
      }
    }

    questionBreakdown.push({
      answerId: correctAnswer,
      playersCorrect: playersCorrect.slice().sort(),
    });
  }

  // checks who got the overall question correct
  const correctPlayers: string[] = [];
  for (const individualPlayerSubmission of playerAnswerSubmissions) {
    if (individualPlayerSubmission.numCorrectAnswers === correctAnswerIds.length) {
      correctPlayers.push(findPlayerfromPlayerId(sessionObj, individualPlayerSubmission.playerId).name);
    }
  }
  question.questionCorrectBreakdown = {
    answerIds: correctAnswerIds,
    playersCorrect: correctPlayers,
  };
  setData(dataStore);

  // Find average answer time
  const numPlayers = sessionObj.players.length;
  let totalTime = 0;
  for (const player of playerAnswerSubmissions) {
    totalTime += answerTime(player.timeSubmitted, question.questionStartTime);
  }
  const averageAnswerTime = totalTime / numPlayers;

  // find the total number of players that got the question correct
  const numberOfCorrectPlayers = question.questionCorrectBreakdown.playersCorrect.length;
  return {
    questionId: questionId,
    questionCorrectBreakdown: questionBreakdown,
    averageAnswerTime: averageAnswerTime,
    percentCorrect: (numberOfCorrectPlayers / numPlayers) * 100
  };
}
/// ///////////////////////////////////////////////////////////////////////////////
/// ///////////////////////// HELPER FUNCTIONS ////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////

export function checkSessionId(dataStore: DataStore, sessionId: number) {
  const sessions = dataStore.sessions;
  return sessions.find(element => element.sessionId === sessionId);
}

export const checkQuizId = (dataStore: DataStore, quizId: number) => {
  const quiz = dataStore.quizzes;
  return quiz.find(element => element.quizId === quizId);
};

function isEnum(action: string) {
  if (action === 'NEXT_QUESTION' || action === 'GO_TO_ANSWER' || action === 'GO_TO_FINAL_RESULTS' || action === 'END') {
    return true;
  }
  return false;
}

const answerTime = (startTime: number, endTime: number) => Math.round(endTime - startTime);
