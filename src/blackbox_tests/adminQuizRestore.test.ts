import { requestClear, requestRegister, requestQuizCreate, requestQuizRemove, requestLogout, requestRestoreQuizV2 } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };

let token1: string;
let token2: string;
let quizId1: number;
let quizId3: number;
let invalidQuizId: number;

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;
  token2 = requestRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreate(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  quizId3 = requestQuizCreate(token2, 'Quiz Three', 'This is the quiz.').body.quizId;
  invalidQuizId = quizId1 - 1;
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestRestoreQuizV2(quizId1, token1);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Valid Token', () => {
    requestQuizRemove(token1, quizId1);
    const validRet = requestRestoreQuizV2(quizId1, token1);
    expect(validRet.status).toStrictEqual(OK);
  });
});

describe('QuizId Tests', () => {
  test('Error 400: Refers to an invalid quizId', () => {
    const invaldRet1 = requestRestoreQuizV2(invalidQuizId, token1);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('Error 400: QuizId under different user', () => {
    const invalidRet2 = requestRestoreQuizV2(quizId3, token1);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('Valid Quiz Id', () => {
    requestQuizRemove(token1, quizId1);
    const validRet = requestRestoreQuizV2(quizId1, token1);
    expect(validRet.status).toStrictEqual(OK);
  });
});

describe('Successful Restoration', () => {
  test('Restore two quizzes for the same users', () => {
    requestQuizRemove(token1, quizId1);
    requestQuizRemove(token2, quizId3);

    expect(requestRestoreQuizV2(quizId1, token1).status).toStrictEqual(OK);
    expect(requestRestoreQuizV2(quizId3, token2).status).toStrictEqual(OK);
  });
});
