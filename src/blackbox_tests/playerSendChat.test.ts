import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestionV2, requestPlayerJoin, requestSendChat } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };
const VALID = { };

let token1: string;
let quizId1: number;
let sessionId1: number;
let invalidPlayerId: number;
let playerId1: number;
let playerId2: number;

const message = 'Hi everyone!';
const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
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
  quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  requestCreateQuestionV2(quizId1, token1, 'validString', 0.1, 5, validArray, jpg);
  requestCreateQuestionV2(quizId1, token1, 'validString2', 0.1, 5, validArray, jpg);

  sessionId1 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
  playerId1 = requestPlayerJoin(sessionId1, 'COMP').body.playerId;
  playerId2 = requestPlayerJoin(sessionId1, 'C1531').body.playerId;
});

afterEach(() => {
  requestClear();
});

describe('Error 400', () => {
  test('PlayerId does not exist', () => {
    invalidPlayerId = 0;
    const invalidRet = requestSendChat(invalidPlayerId, message);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Message body has less than 1 character', () => {
    const messageShort = '';
    const invalidRet = requestSendChat(playerId1, messageShort);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Message body has more than 100 characters', () => {
    const messageLong = 'This extremely long sentence has the length of more than one hundred characters which makes it annoying.';
    const invalidRet = requestSendChat(playerId1, messageLong);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('One player sends message', () => {
    const validRet = requestSendChat(playerId1, message);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
  });

  test('Two players send same chat', () => {
    requestSendChat(playerId1, message);
    const validRet = requestSendChat(playerId2, message);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
  });
});
