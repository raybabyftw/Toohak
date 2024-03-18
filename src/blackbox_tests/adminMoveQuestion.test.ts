import {
  requestClear, requestRegister, requestQuizCreate, requestMoveQuestion, requestCreateQuestion, requestLogout,
  requestDeleteQuestion, requestQuizInfo
} from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };
let ret, token1: any, token2: any, quizId1: number, quizId2: number, questId1: number, questId2: number, questId3: number, questId4: number;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  quizId1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
  questId1 = requestCreateQuestion(quizId1, token1, 'waddup', 7, 5, [{ answer: 'hello', correct: false }, { answer: 'myyy', correct: true }]).body.questionId;
  questId2 = requestCreateQuestion(quizId1, token1, 'yooyooy', 1, 2, [{ answer: 'nice', correct: true }, { answer: 'wazzaaaa', correct: true }]).body.questionId;
  questId3 = requestCreateQuestion(quizId1, token1, 'eating', 1, 2, [{ answer: 'sleyyy', correct: true }, { answer: 'tooook', correct: true }]).body.questionId;
});

describe('Success cases', () => {
  test('Move question', () => {
    ret = requestMoveQuestion(token1, quizId1, questId1, 2);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
    ret = requestQuizInfo(token1, quizId1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: quizId1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1511',
        numQuestions: 3,
        questions: [
          {
            questionId: questId2,
            question: 'yooyooy',
            duration: 1,
            points: 2,
            answers: [
              {
                answer: 'nice',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
              {
                answer: 'wazzaaaa',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
          {
            questionId: questId3,
            question: 'eating',
            duration: 1,
            points: 2,
            answers: [
              {
                answer: 'sleyyy',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
              {
                answer: 'tooook',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
          {
            questionId: questId1,
            question: 'waddup',
            duration: 7,
            points: 5,
            answers: [
              {
                answer: 'hello',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'myyy',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
        ],
        duration: 9
      });
  });
  test('Move question to position of a deleted question', () => {
    requestDeleteQuestion(quizId1, questId2, token1);
    ret = requestMoveQuestion(token1, quizId1, questId1, 1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
    ret = requestQuizInfo(token1, quizId1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: quizId1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1511',
        numQuestions: 2,
        questions: [
          {
            questionId: questId3,
            question: 'eating',
            duration: 1,
            points: 2,
            answers: [
              {
                answer: 'sleyyy',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
              {
                answer: 'tooook',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
          {
            questionId: questId1,
            question: 'waddup',
            duration: 7,
            points: 5,
            answers: [
              {
                answer: 'hello',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'myyy',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
        ],
        duration: 8
      });
  });
});

describe('Error code 400', () => {
  test('Invalid QuizId', () => {
    const invalidQuizId = quizId1 - 1;
    ret = requestMoveQuestion(token1, invalidQuizId, questId1, 2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('QuizId does not belong to user', () => {
    const token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    const quizId2 = requestQuizCreate(token2, 'Glizzy', 'Game for 1521').body.quizId;
    ret = requestMoveQuestion(token1, quizId2, questId1, 2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    quizId2 = requestQuizCreate(token2, 'Glizzy', 'Game for 1521').body.quizId;
    questId4 = requestCreateQuestion(quizId2, token2, 'input question?', 1, 7, [{ answer: 'hello', correct: true }, { answer: 'thy', correct: true }]).body.questionId;
    ret = requestMoveQuestion(token1, quizId1, questId4, 2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('NewPosition is less than 0', () => {
    ret = requestMoveQuestion(token1, quizId1, questId2, -8);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('NewPosition is greater the number of questions', () => {
    ret = requestMoveQuestion(token1, quizId1, questId3, 5);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('NewPosition is the position of the current position', () => {
    ret = requestMoveQuestion(token1, quizId1, questId1, 0);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    requestLogout(token1);
    ret = requestMoveQuestion(token1, quizId1, questId1, 0);
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});
