import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestion, requestPlayerJoin, requestPlayerStatus, requestSessionUpdate } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };

let token1: string;
let quizId1: number;
let autoStartNum: number;
let sessionId: number;
let playerId1: number, playerId2: number;

const validArray = [
  {
    answer: 'answer',
    correct: true
  },
  {
    answer: 'notAnswer',
    correct: false
  }
];

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;

  autoStartNum = 5;

  requestCreateQuestion(quizId1, token1, 'validString', 0.5, 5, validArray);
  requestCreateQuestion(quizId1, token1, 'validString2', 0.5, 5, validArray);

  sessionId = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;

  playerId1 = requestPlayerJoin(sessionId, 'Rayhan').body.playerId;
  playerId2 = requestPlayerJoin(sessionId, 'Andrew').body.playerId;
});

describe('Error 400', () => {
  test('Player ID does not exist', () => {
    const ret = requestPlayerStatus(5);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });
});

describe('Successful Case', () => {
  test('Status of first player and second player in Lobby', () => {
    const ret1 = requestPlayerStatus(playerId1);
    expect(ret1.status).toStrictEqual(OK);
    expect(ret1.body).toStrictEqual({
      state: 'LOBBY',
      numQuestions: 2,
      atQuestion: 0
    });

    const ret2 = requestPlayerStatus(playerId2);
    expect(ret2.status).toStrictEqual(OK);
    expect(ret2.body).toStrictEqual({
      state: 'LOBBY',
      numQuestions: 2,
      atQuestion: 0
    });
  });

  test('Status in first question', () => {
    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');

    const ret = requestPlayerStatus(playerId2);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      state: 'QUESTION_COUNTDOWN',
      numQuestions: 2,
      atQuestion: 0
    });
  });

  test('Status in second question', () => {
    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');

    sleepSync(0.5 * 1000);

    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');

    const ret = requestPlayerStatus(playerId2);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      state: 'QUESTION_OPEN',
      numQuestions: 2,
      atQuestion: 1
    });
  });
});

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}
