import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestionV2, requestPlayerJoin, requestSendChat, requestViewChat } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };

let token1: string;
let quizId1: number;
let sessionId1: number;
let invalidPlayerId: number;
let playerId1: number;
let playerId2: number;

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

  requestSendChat(playerId1, 'Hey there guys!');
  requestSendChat(playerId2, 'I hate you!');
});

afterEach(() => {
  requestClear();
});

describe('Error 400', () => {
  test('PlayerId does not exist', () => {
    invalidPlayerId = 17;
    const invalidRet = requestViewChat(invalidPlayerId);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('Two players send messages', () => {
    const validRet = requestViewChat(playerId1);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual({
      messages: [
        {
          messageBody: 'Hey there guys!',
          playerId: playerId1,
          playerName: 'COMP',
          timeSent: expect.any(Number)
        },
        {
          messageBody: 'I hate you!',
          playerId: playerId2,
          playerName: 'C1531',
          timeSent: expect.any(Number)
        }
      ]
    });
  });

  test('Two players send same chat', () => {
    requestSendChat(playerId2, 'Hey there guys!');
    requestSendChat(playerId1, 'I hate you!');

    const validRet = requestViewChat(playerId2);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual({
      messages: [
        {
          messageBody: 'Hey there guys!',
          playerId: playerId1,
          playerName: 'COMP',
          timeSent: expect.any(Number)
        },
        {
          messageBody: 'I hate you!',
          playerId: playerId2,
          playerName: 'C1531',
          timeSent: expect.any(Number)
        },
        {
          messageBody: 'Hey there guys!',
          playerId: playerId2,
          playerName: 'C1531',
          timeSent: expect.any(Number)
        },
        {
          messageBody: 'I hate you!',
          playerId: playerId1,
          playerName: 'COMP',
          timeSent: expect.any(Number)
        }
      ]
    });
  });
});
