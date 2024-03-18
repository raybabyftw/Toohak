import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestionV2, requestPlayerJoin, requestPlayerQuestionInfo, requestSessionUpdate } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };

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

const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
let token1: string, token1quizId1: number, sessionId1: number;
let playerId1: number, playerId2: number;
let questionId1: number, questionId2: number;

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

beforeEach(() => {
  requestClear();
  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;

  token1quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  questionId1 = requestCreateQuestionV2(token1quizId1, token1, 'validString1', 0.1, 5, validArray, jpg).body.questionId;
  questionId2 = requestCreateQuestionV2(token1quizId1, token1, 'validString2', 0.1, 5, validArray, jpg).body.questionId;

  sessionId1 = requestSessionStart(token1quizId1, token1, 5).body.sessionId;

  playerId1 = requestPlayerJoin(sessionId1, 'Rayhan').body.playerId;
  playerId2 = requestPlayerJoin(sessionId1, 'Andrew').body.playerId;
});

afterEach(() => {
  requestClear();
});

describe('Error code 400', () => {
  test('PlayerId does not exist', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

    const ret = requestPlayerQuestionInfo(17, 1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Question position is not valid for the session this player is in', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

    const ret = requestPlayerQuestionInfo(playerId1, 6);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Question position is not valid for the session this player is in', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

    const ret = requestPlayerQuestionInfo(playerId1, 0);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is not currently on this question', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

    const ret = requestPlayerQuestionInfo(playerId1, 2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is in LOBBY state', () => {
    const ret = requestPlayerQuestionInfo(playerId1, 1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is in END state', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'END');

    const ret = requestPlayerQuestionInfo(playerId1, 1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('Success case for first player, first question', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');
    sleepSync(100);

    const ret = requestPlayerQuestionInfo(playerId1, 1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      questionId: questionId1,
      question: 'validString1',
      duration: 0.1,
      thumbnailUrl: expect.any(String),
      points: 5,
      answers: [
        {
          answerId: expect.any(Number),
          answer: 'answer',
          colour: expect.any(String)
        }
      ]
    });
  });

  test('Success case for second player, second question', () => {
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');
    sleepSync(200);
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');
    sleepSync(200);
    const ret = requestPlayerQuestionInfo(playerId2, 2);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      questionId: questionId2,
      question: 'validString2',
      duration: 0.1,
      thumbnailUrl: expect.any(String),
      points: 5,
      answers: [
        {
          answerId: expect.any(Number),
          answer: 'answer',
          colour: expect.any(String)
        }
      ]
    });
  });
});
