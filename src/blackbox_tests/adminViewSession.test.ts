import { requestClear, requestRegister, requestQuizCreateV2, requestLogout, requestSessionStart, requestCreateQuestionV2, requestSessionUpdate, requestViewSessions } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };

let token1: string;
let token2: string;
let quizId1: number;
let quizId2: number;
let invalidQuizId: number;
let sessionId1: number;
let sessionId2: number;
let sessionId3: number;
let sessionId4: number;
let sessionId5: number;
let sessionId6: number;
const autoStartNum = 5;

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
  token2 = requestRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  quizId2 = requestQuizCreateV2(token2, 'Quiz Three', 'This is the quiz.').body.quizId;

  requestCreateQuestionV2(quizId1, token1, 'validString', 0.1, 5, validArray);
  requestCreateQuestionV2(quizId1, token1, 'validString2', 0.1, 5, validArray);

  sessionId1 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  sessionId2 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  sessionId3 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  sessionId4 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  sessionId5 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  sessionId6 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
});

afterEach(() => {
  requestClear();
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestViewSessions(quizId1, token1);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Error 400', () => {
  test('Refers to an invalid quizId', () => {
    invalidQuizId = quizId1 - 1;
    const invaldRet1 = requestViewSessions(invalidQuizId, token1);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('QuizId under different user', () => {
    const invalidRet2 = requestViewSessions(quizId2, token1);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('Check multiple inactive and active quizzes', () => {
    requestViewSessions(quizId1, token1);
    requestSessionUpdate(quizId1, sessionId1, token1, 'END');
    requestSessionUpdate(quizId1, sessionId2, token1, 'END');
    requestSessionUpdate(quizId1, sessionId3, token1, 'END');
    const validRet = requestViewSessions(quizId1, token1);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body.activeSessions).toEqual(expect.arrayContaining([
      sessionId4,
      sessionId5,
      sessionId6
    ]));
    expect(validRet.body.inactiveSessions).toEqual(expect.arrayContaining([
      sessionId1,
      sessionId2,
      sessionId3,
    ]));
  });

  test('No inactive quizzes', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, 'END');
    requestSessionUpdate(quizId1, sessionId2, token1, 'END');
    requestSessionUpdate(quizId1, sessionId3, token1, 'END');
    requestSessionUpdate(quizId1, sessionId4, token1, 'END');
    requestSessionUpdate(quizId1, sessionId5, token1, 'END');
    requestSessionUpdate(quizId1, sessionId6, token1, 'END');
    const validRet = requestViewSessions(quizId1, token1);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body.inactiveSessions).toEqual(expect.arrayContaining([
      sessionId1,
      sessionId2,
      sessionId3,
      sessionId4,
      sessionId5,
      sessionId6
    ]));
  });

  test('No inactive quizzes', () => {
    const validRet = requestViewSessions(quizId1, token1);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body.activeSessions).toEqual(expect.arrayContaining([
      sessionId1,
      sessionId2,
      sessionId3,
      sessionId4,
      sessionId5,
      sessionId6
    ]));
  });
});
