import { quizAnswer } from '../dataStore';
import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestionV2, requestPlayerJoin, requestPlayerQuestionInfo, requestSessionUpdate, requestPlayerSubmission } from './routeRequestHelper';

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
  },
  {
    answer: 'alsoAnswer',
    correct: true
  },
  {
    answer: 'alsoNotAnswer',
    correct: false
  }
];

const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
let token1: string, token1quizId1: number, sessionId1: number;
let playerId1: number, playerId2: number;
let answerArray: quizAnswer[];
let playerAnswer: number[] = [];

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
  requestCreateQuestionV2(token1quizId1, token1, 'validString1', 0.1, 5, validArray, jpg);
  requestCreateQuestionV2(token1quizId1, token1, 'validString2', 0.1, 5, validArray, jpg);

  sessionId1 = requestSessionStart(token1quizId1, token1, 5).body.sessionId;

  playerId1 = requestPlayerJoin(sessionId1, 'Rayhan').body.playerId;
  playerId2 = requestPlayerJoin(sessionId1, 'Andrew').body.playerId;

  requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

  sleepSync(100);
  answerArray = requestPlayerQuestionInfo(playerId1, 1).body.answers;

  playerAnswer = answerArray.map((val) => {
    return val.answerId;
  });
});

afterEach(() => {
  requestClear();
});

describe('Error code 400', () => {
  test('PlayerId does not exist', () => {
    const ret = requestPlayerSubmission(17, 1, playerAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Question position is not valid for the session this player is in', () => {
    const ret = requestPlayerSubmission(playerId1, 15, playerAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is not in QUESTION_OPEN state', () => {
    sleepSync(100);
    const ret = requestPlayerSubmission(playerId1, 1, playerAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is not yet up to this question', () => {
    const ret = requestPlayerSubmission(playerId1, 2, playerAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Answer IDs are not valid for this particular question', () => {
    const invalidAnswer = [
      4
    ];
    const ret = requestPlayerSubmission(playerId1, 1, invalidAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('There are duplicate answer IDs provided', () => {
    const invalidAnswer2 = [
      playerAnswer[0],
      playerAnswer[0]
    ];

    const ret = requestPlayerSubmission(playerId1, 1, invalidAnswer2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Less than 1 answer ID was submitted', () => {
    const invalidAnswer: any = [];
    const ret = requestPlayerSubmission(playerId1, 1, invalidAnswer);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('Success case for first player, first question answer submission is correct', () => {
    const ret = requestPlayerSubmission(playerId1, 1, playerAnswer);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
  });

  test('Success case for first player, first question answer submission after a resubmit is correct', () => {
    requestPlayerSubmission(playerId1, 1, [0, 1]);
    const ret = requestPlayerSubmission(playerId1, 1, playerAnswer);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
  });

  test('Success case for second player, second question answer submission is correct', () => {
    sleepSync(100);
    requestSessionUpdate(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

    sleepSync(100);

    const ret = requestPlayerSubmission(playerId2, 2, playerAnswer);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
  });
});
