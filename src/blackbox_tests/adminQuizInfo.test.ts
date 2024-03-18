import {
  requestClear, requestRegister, requestQuizInfo, requestQuizCreate, requestCreateQuestion, requestDeleteQuestion,
  requestLogout
} from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };
let ret, token1: any, token1Quiz1: number, question1Id: number, question2Id: number;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  token1Quiz1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
  question1Id = requestCreateQuestion(token1Quiz1, token1, 'Who is the Monarch of England?', 4, 5, [{ answer: 'hello', correct: false }, { answer: 'is', correct: true }]).body.questionId;
});

describe('Successful cases', () => {
  test('Quiz info containing a single question', () => {
    ret = requestQuizInfo(token1, token1Quiz1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: token1Quiz1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1511',
        numQuestions: 1,
        questions: [
          {
            questionId: question1Id,
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
        duration: 4
      });
  });

  test('Quiz info after the addition of a question', () => {
    question2Id = requestCreateQuestion(token1Quiz1, token1, 'Chuck question here?', 4, 5, [{ answer: 'heeeeey', correct: false }, { answer: 'yuuuh', correct: true }]).body.questionId;
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
            questionId: question1Id,
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
            questionId: question2Id,
            question: 'Chuck question here?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'heeeeey',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'yuuuh',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              }
            ]
          }
        ],
        duration: 8
      }
    );
  });

  test('Quiz info after deletion of a question', () => {
    question2Id = requestCreateQuestion(token1Quiz1, token1, 'Chuck question here?', 4, 5, [{ answer: 'heeeeey', correct: false }, { answer: 'yuuuh', correct: true }]).body.questionId;
    requestDeleteQuestion(token1Quiz1, question2Id, token1);
    ret = requestQuizInfo(token1, token1Quiz1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: token1Quiz1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1511',
        numQuestions: 1,
        questions: [
          {
            questionId: question1Id,
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
        duration: 4
      }
    );
  });
});

describe('Error code 400', () => {
  test('Invalid QuizId', () => {
    const invalidQuizId = token1Quiz1 - 1;
    ret = requestQuizInfo(token1, invalidQuizId);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('QuizId does not belong to user', () => {
    const token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    ret = requestQuizInfo(token2, token1Quiz1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    requestLogout(token1);
    ret = requestQuizInfo(token1, token1Quiz1);
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});
