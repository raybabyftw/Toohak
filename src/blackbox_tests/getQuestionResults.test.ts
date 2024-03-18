import {
  requestClear, requestRegister, requestQuizCreateV2, requestCreateQuestionV2,
  requestSessionStart, requestQuestionResults, requestPlayerJoin, requestPlayerSubmission, requestSessionUpdate
} from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const ERROR_STRING = { error: expect.any(String) };

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

let token1: string, quizId1: number, sessionId: number, playerId1: number, playerId2: number, questionId1: number, questionId2: number;
beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  quizId1 = requestQuizCreateV2(token1, 'Quizzy', 'Game for 1511').body.quizId;
  questionId1 = requestCreateQuestionV2(quizId1, token1, 'Who is the Monarch of England?', 0.1, 5, [{ answer: 'hello', correct: false }, { answer: 'is', correct: true }, { answer: 'howdy', correct: true }]).body.questionId;
  questionId2 = requestCreateQuestionV2(quizId1, token1, 'Chuck question here?', 0.1, 5, [{ answer: 'heeeeey', correct: false }, { answer: 'yuuuh', correct: true }]).body.questionId;
  sessionId = requestSessionStart(quizId1, token1, 3).body.sessionId;
  playerId1 = requestPlayerJoin(sessionId, 'Hayden').body.playerId;
  playerId2 = requestPlayerJoin(sessionId, 'Lina').body.playerId;
  requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');
  sleepSync(100);
});

describe('Error code 400', () => {
  test('PlayerId does not exist', () => {
    const invalidPlayerId = playerId1 - 1;
    const ret = requestQuestionResults(invalidPlayerId, 1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Question position is invalid for session player is in', () => {
    const ret = requestQuestionResults(playerId1, 3);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Session is not in ANSWER_SHOW state', () => {
    const ret = requestQuestionResults(playerId1, 1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Session is not yet up to this question', () => {
    const ret = requestQuestionResults(playerId1, 2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success case', () => {
  test('Question results with players choosing correct answer', () => { // first q
    requestPlayerSubmission(playerId1, 1, [1, 2]);
    requestPlayerSubmission(playerId2, 1, [1]);
    sleepSync(100);
    requestSessionUpdate(quizId1, sessionId, token1, 'GO_TO_ANSWER');
    const ret = requestQuestionResults(playerId1, 1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        questionId: questionId1,
        questionCorrectBreakdown: [
          {
            answerId: 1,
            playersCorrect: [
              'Hayden',
              'Lina'
            ]
          },
          {
            answerId: 2,
            playersCorrect: [
              'Hayden',
            ]
          }
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 50
      });
  });

  test('Question results with no players choosing correct answer', () => { // second q
    sleepSync(100);
    requestSessionUpdate(quizId1, sessionId, token1, 'GO_TO_ANSWER');
    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');
    sleepSync(100);
    requestPlayerSubmission(playerId1, 2, [1]);
    requestPlayerSubmission(playerId2, 2, [1]);
    sleepSync(100);
    requestSessionUpdate(quizId1, sessionId, token1, 'GO_TO_ANSWER');
    const ret = requestQuestionResults(playerId1, 2);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        questionId: questionId2,
        questionCorrectBreakdown: [
          {
            answerId: 1,
            playersCorrect: [
              'Hayden',
              'Lina'
            ]
          }
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 100
      });
  });
});
