import { requestClear, requestRegister, requestQuizCreate, requestQuizRemove, requestLogout, requestQuizzesTrashV2 } from './routeRequestHelper';

const OK = 200;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };

let token1: string;
let token2: string;
let quizId1: number;
let quizId2: number;
let quizId3: number;

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;
  token2 = requestRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreate(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  quizId2 = requestQuizCreate(token1, 'Quiz Two', 'This is the quiz.').body.quizId;
  quizId3 = requestQuizCreate(token2, 'Quiz Three', 'This is the quiz.').body.quizId;
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestQuizzesTrashV2(token1);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Valid Token', () => {
    const validRet = requestQuizzesTrashV2(token1);
    expect(validRet.status).toStrictEqual(OK);
  });
});

describe('Successful Quiz List', () => {
  test('No quizzes in trash', () => {
    const validRet = requestQuizzesTrashV2(token1);
    expect(validRet.body).toStrictEqual({
      quizzes: []
    });
  });
  test('Remove multiple quizzes', () => {
    requestQuizRemove(token1, quizId1);
    requestQuizRemove(token1, quizId2);
    requestQuizRemove(token2, quizId3);

    const validRet = requestQuizzesTrashV2(token1);
    expect(validRet.body).toStrictEqual({
      quizzes: [
        {
          quizId: quizId1,
          name: 'Quiz One',
        },
        {
          quizId: quizId2,
          name: 'Quiz Two',
        },
      ]
    });
    expect(validRet.status).toStrictEqual(OK);

    const validRet2 = requestQuizzesTrashV2(token2);
    expect(validRet2.body).toStrictEqual({
      quizzes: [
        {
          quizId: quizId3,
          name: 'Quiz Three',
        },
      ]
    });
  });
});
