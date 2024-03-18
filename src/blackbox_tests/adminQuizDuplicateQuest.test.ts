
import {
  requestClear, requestRegister, requestQuizCreate, requestDuplicateQuestion, requestCreateQuestion,
  requestQuizInfo
} from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

let ret, token1: any, token2: any, question1Id1: number, question1Id2: number, token1Quiz1: number, token2Quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  token1Quiz1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
  question1Id1 = requestCreateQuestion(token1Quiz1, token1, 'Who is the Monarch of England?', 4, 5, [{ answer: 'hello', correct: false }, { answer: 'is', correct: true }]).body.questionId;
});

describe('Success case', () => {
  test('Duplicated question', () => {
    ret = requestDuplicateQuestion(token1, token1Quiz1, question1Id1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({ newQuestionId: expect.any(Number) });
    ret = requestQuizInfo(token1, token1Quiz1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: token1Quiz1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1511',
        numQuestions: 2,
        questions: [
          {
            questionId: question1Id1,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'hello',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'is',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          },
          {
            questionId: expect.any(Number),
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'hello',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'is',
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
    const invalidQuizId = token1Quiz1 - 1;
    ret = requestDuplicateQuestion(token1, invalidQuizId, question1Id1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('QuizId does not belong to user', () => {
    token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    token2Quiz1 = requestQuizCreate(token2, 'Glizzy', 'Game for 1521').body.quizId;
    ret = requestDuplicateQuestion(token1, token2Quiz1, question1Id1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    token2Quiz1 = requestQuizCreate(token2, 'Glizzy', 'Game for 1521').body.quizId;
    question1Id2 = requestCreateQuestion(token2Quiz1, token2, 'Chuck question here?', 4, 5, [{ answer: 'heeeeey', correct: false }, { answer: 'yuuuh', correct: true }]).body.questionId;
    ret = requestDuplicateQuestion(token1, token1Quiz1, question1Id2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    ret = requestDuplicateQuestion('99999999', token1Quiz1, question1Id1);
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});
