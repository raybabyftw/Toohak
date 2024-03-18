import { requestClear, requestRegister, requestQuizCreate, requestQuizRemoveV2, requestLogout, requestQuizList } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };

let token1: string;
let token2: string;
let quizId1: number;
let quizId2: number;
let quizId3: number;
let invalidQuizId: number;

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;
  token2 = requestRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreate(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  quizId2 = requestQuizCreate(token1, 'Quiz Two', 'This is the quiz.').body.quizId;
  quizId3 = requestQuizCreate(token2, 'Quiz Three', 'This is the quiz.').body.quizId;
  invalidQuizId = quizId1 - 1;
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestQuizRemoveV2(token1, quizId1);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Valid Token', () => {
    const validRet = requestQuizRemoveV2(token1, quizId1);
    expect(validRet.status).toStrictEqual(OK);
  });
});

describe('QuizId Tests', () => {
  test('Error 400: Refers to an invalid quizId', () => {
    const invaldRet1 = requestQuizRemoveV2(token1, invalidQuizId);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('Error 400: QuizId under different user', () => {
    const invalidRet2 = requestQuizRemoveV2(token1, quizId3);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('Valid Quiz Id', () => {
    const validRet = requestQuizRemoveV2(token1, quizId1);
    expect(validRet.status).toStrictEqual(OK);
  });
});

describe('Successful Removal', () => {
  test('Check if quiz was removed.', () => {
    const validRet = requestQuizRemoveV2(token1, quizId2);

    // quizId2 removed from token1. Thus, quizId1 should be remaining.
    expect(requestQuizList(token1).body).toStrictEqual({
      quizzes: [
        {
          quizId: quizId1,
          name: 'Quiz One',
        }
      ]
    });

    expect(validRet.status).toStrictEqual(OK);
  });

  test('Check to see if two quizzes for the same user is removed correctly.', () => {
    expect(requestQuizRemoveV2(token1, quizId1).status).toStrictEqual(OK);
    expect(requestQuizRemoveV2(token1, quizId2).status).toStrictEqual(OK);
    expect(requestQuizList(token1).body).toStrictEqual({
      quizzes: [
      ]
    });
  });
});
