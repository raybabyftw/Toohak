import { requestClear, requestRegister, requestQuizCreate, requestNameUpdateV2, requestQuizRemove, requestQuizList } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

let token1: string, token1Quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  token1Quiz1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
});

describe('Error code 400', () => {
  test('Invalid QuizId', () => {
    const invalidQuizId = token1Quiz1 - 1;
    const ret = requestNameUpdateV2(token1, invalidQuizId, 'rename');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('QuizId does not belong to user', () => {
    const token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    requestQuizCreate(token2, 'Glizzy', 'Game for 1521');
    const ret = requestNameUpdateV2(token2, token1Quiz1, 'rename');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name contains invalid characters', () => {
    const ret = requestNameUpdateV2(token1, token1Quiz1, 'ren@me');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is too short', () => {
    const ret = requestNameUpdateV2(token1, token1Quiz1, 'r');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is too long', () => {
    const ret = requestNameUpdateV2(token1, token1Quiz1, 'r'.repeat(50));
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is already in use', () => {
    requestQuizCreate(token1, 'Litty', 'Game for 1531');
    const ret = requestNameUpdateV2(token1, token1Quiz1, 'Litty');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    const ret = requestNameUpdateV2('asdlkj', token1Quiz1, 'rename');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Successful cases', () => {
  test('Renamed 1 quiz successfully', () => {
    const ret = requestNameUpdateV2(token1, token1Quiz1, 'rename');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
    expect(requestQuizList(token1).body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1Quiz1,
            name: 'rename'
          }
        ]
      }
    );
  });
  test('Renamed quiz using name from quiz in trash', () => {
    requestNameUpdateV2(token1, token1Quiz1, 'rename');
    const token1quiz2 = requestQuizCreate(token1, 'Quizlet', 'Game for 1551').body.quizId;
    requestQuizRemove(token1, token1Quiz1);
    requestNameUpdateV2(token1, token1quiz2, 'rename');
    expect(requestQuizList(token1).body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1quiz2,
            name: 'rename'
          }
        ]
      }
    );
  });
});
