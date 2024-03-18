import { requestClear, requestRegister, requestQuizCreate, requestEmptyTrash, requestLogout, requestQuizRemove, requestQuizzesTrash, requestEmptyTrashV2 } from './routeRequestHelper';

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
    const invalidRet = requestEmptyTrashV2(token1, JSON.stringify([quizId1]));
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('QuizId Tests', () => {
  test('Error 400: Refers to an invalid quizId', () => {
    const invaldRet1 = requestEmptyTrashV2(token1, JSON.stringify([invalidQuizId]));
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('Error 400: QuizId under different user', () => {
    const invalidRet2 = requestEmptyTrashV2(token1, JSON.stringify([quizId3]));
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('Error 400: One or more of the Quiz IDs is not currently in the trash', () => {
    const invalidRet3 = requestEmptyTrashV2(token1, JSON.stringify([quizId1]));
    expect(invalidRet3.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet3.body).toStrictEqual(ERROR);
  });
});

describe('Successful Case', () => {
  test('All of users quizzes are emptied from trash', () => {
    requestQuizRemove(token1, quizId1);
    requestQuizRemove(token1, quizId2);
    const validRet = requestQuizzesTrash(token1);
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
    expect(requestEmptyTrash(token1, JSON.stringify([quizId1, quizId2])).status).toStrictEqual(OK);
    const validRet1 = requestQuizzesTrash(token1);
    expect(validRet1.body).toStrictEqual({
      quizzes: [
      ]
    });
  });
});
