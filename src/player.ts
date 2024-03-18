import { getData, setData, getTimers, setTimers, DataStore } from './dataStore';
import { findSessionFromPlayerId } from './helper';
import HTTPError from 'http-errors';

const COUNTDOWN_TIME = 0.1 * 1000;

export function playerJoin(sessionId: number, name: string) {
  const dataStore = getData();

  for (const session of dataStore.sessions) {
    if (session.sessionId === sessionId) {
      for (const player of session.players) {
        if (player.name === name) {
          throw HTTPError(400, 'Name of user entered is not unique');
        }
      }
      if (session.state !== 'LOBBY') {
        throw HTTPError(400, 'Session is not in LOBBY state');
      }

      const rn = require('random-number');

      const newPlayerName = getName(name);
      const newPlayerId = rn() + 1;

      session.players.push({
        playerId: newPlayerId,
        name: newPlayerName,
        answerTime: 0
      });

      if (session.players.length === session.autoStartNum) {
        session.state = 'QUESTION_COUNTDOWN';
        dataStore.isTimerRunning = true;
        setData(dataStore);

        const timers = getTimers();
        const timerId = setTimeout(() => questionOpen(session, dataStore), COUNTDOWN_TIME);
        timers.push(timerId);
        setTimers(timers);
      }

      // sleepSync(500);

      if (session.state !== 'LOBBY') {
        throw HTTPError(400, 'Session is not in LOBBY state');
      }

      setData(dataStore);
      return {
        playerId: newPlayerId
      };
    }
  }

  setData(dataStore);
}

export function playerSendChat(playerId: number, messageBody: string) {
  const dataStore = getData();
  const session = findSessionFromPlayerId(playerId, dataStore);

  if (messageBody.length < 1 || messageBody.length > 100) {
    throw HTTPError(400, 'Please enter a message between 1 and 100 characters.');
  }

  const player = session.players.find(element => element.playerId === playerId);
  const timeSent = Date.now() / 1000;

  const message = {
    messageBody: messageBody,
    playerId: playerId,
    playerName: player.name,
    timeSent: timeSent,
  };

  session.messages.push(message);
  setData(dataStore);
  return {};
}

export function playerStatus(playerId: number) {
  const dataStore = getData();
  const session = findSessionFromPlayerId(playerId, dataStore);
  return {
    state: session.state,
    numQuestions: session.numQuestions,
    atQuestion: session.atQuestion
  };
}

export function playerQuestionInfo(playerid: number, questionposition: number) {
  const dataStore = getData();
  const correctanswers = [];
  const session = findSessionFromPlayerId(playerid, dataStore);

  if (session.state === 'LOBBY') {
    throw HTTPError(400, 'Session is in LOBBY state');
  } else if (session.state === 'END') {
    throw HTTPError(400, 'Session is in END state');
  } else if (questionposition > session.metadata.questions.length) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  } else if (questionposition === 0) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  } else if (session.atQuestion !== questionposition) {
    throw HTTPError(400, 'Session is not currently on this question');
  }

  const copy = session.metadata;
  const questionreturn = copy.questions[questionposition - 1];

  for (const answer of questionreturn.answers) {
    if (answer.correct === true) {
      correctanswers.push({
        answerId: answer.answerId,
        answer: answer.answer,
        colour: answer.colour,
      });
    }
  }

  return {
    questionId: questionreturn.questionId,
    question: questionreturn.question,
    duration: questionreturn.duration,
    thumbnailUrl: questionreturn.thumbnailUrl,
    points: questionreturn.points,
    answers: correctanswers
  };
}

export function adminPlayerAnswerSubmission(playerid: number, questionposition: number, answerIds: number[]) {
  const dataStore = getData();
  const session = findSessionFromPlayerId(playerid, dataStore);
  if (answerIds.length < 1) {
    throw HTTPError(400, 'Less than 1 answer ID was submitted');
  } else if (new Set(answerIds).size !== answerIds.length) {
    throw HTTPError(400, 'There are duplicate answer IDs provided');
  }

  if (questionposition > session.metadata.questions.length || questionposition < 1) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  } else if (session.state !== 'QUESTION_OPEN') {
    throw HTTPError(400, 'Session is not in QUESTION_OPEN state');
  } else if (session.atQuestion !== questionposition) {
    throw HTTPError(400, 'Session is not yet up to this question');
  }

  const answers = session.metadata.questions[questionposition - 1].answers;
  const answerIdArray = answers.map((val) => {
    return val.answerId;
  });

  if (!answerIds.every(val => answerIdArray.includes(val))) {
    throw HTTPError(400, 'Answer IDs are not valid for this particular question');
  }

  const playerSubmitObj = {
    playerId: playerid,
    answersSubmitted: answerIds,
    timeSubmitted: Date.now() / 1000,
    numCorrectAnswers: 0,
  };
  const index = session.sessiondata[questionposition - 1].submittedAnswers.findIndex(element => element.playerId === playerid);
  if (index === -1) {
    session.sessiondata[questionposition - 1].submittedAnswers.push(playerSubmitObj);
  } else {
    session.sessiondata[questionposition - 1].submittedAnswers[index] = playerSubmitObj;
  }

  setData(dataStore);
  return {};
}

export function playerViewChat(playerId: number) {
  const dataStore = getData();
  const session = findSessionFromPlayerId(playerId, dataStore);
  return {
    messages: session.messages
  };
}

// HELPER FUNCTIONS \\

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let name = '';

  for (let i = 0; i < 5; i++) {
    let index: number;
    do {
      index = getRandomInt(0, letters.length - 1);
    } while (name.includes(letters[index]));
    name += letters[index];
  }
  for (let i = 0; i < 3; i++) {
    let index: number;
    do {
      index = getRandomInt(0, numbers.length - 1);
    } while (name.includes(numbers[index]));
    name += numbers[index];
  }

  return name;
}

function getName(inputName: string): string {
  return inputName === '' ? generateUniqueName() : inputName;
}

export function questionOpen(session: any, dataStore: DataStore) {
  session.state = 'QUESTION_OPEN';
  session.atQuestion++;
  const question = session.metadata.questions[session.atQuestion - 1];
  const countdownTime = question.duration * 1000;

  session.sessiondata.push({
    questionId: session.metadata.questions[session.atQuestion - 1].questionId,
    submittedAnswers: [],
    questionStartTime: Date.now() / 1000,
    questionCorrectBreakdown: [],
    averageAnswerTime: 0,
    percentCorrect: 0
  });

  setData(dataStore);

  const timers = getTimers();
  const timerId = setTimeout(() => questionClose(session, dataStore), countdownTime);
  timers.push(timerId);
  setTimers(timers);

  return {};
}

function questionClose(session: any, dataStore: DataStore) {
  session.state = 'QUESTION_CLOSE';
  dataStore.isTimerRunning = false;
  setData(dataStore);
  return {};
}
