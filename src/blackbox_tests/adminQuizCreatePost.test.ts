import { requestClear, requestRegister, requestQuizCreateV2, requestQuizRemove } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

let token1: string;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
});

describe('Error code 400', () => {
  test('Name contains invalid characters', () => {
    const ret = requestQuizCreateV2(token1, 'Qu!zzy', 'Game for 1511');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is too short', () => {
    const ret = requestQuizCreateV2(token1, 'Q', 'Game for 1511');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is too long', () => {
    const ret = requestQuizCreateV2(token1, 'Q'.repeat(50), 'Game for 1511'.repeat(50));
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Name is already in use', () => {
    requestQuizCreateV2(token1, 'Quizzy', 'Game for 1511');
    const ret = requestQuizCreateV2(token1, 'Quizzy', 'Game for 1521');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Description is too long', () => {
    const ret = requestQuizCreateV2(token1, 'Quizzy', 'q'.repeat(101));
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    const ret = requestQuizCreateV2('asdlkj', 'Quizzy', 'Game for 1511');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success Cases', () => {
  test('Create a valid Quiz', () => {
    const ret = requestQuizCreateV2(token1, 'Quizzy', 'Game for 1511');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizId: 1
      }
    );
    expect(ret.body.quizId).toStrictEqual(1);
  });

  test('Create a valid Quiz using name that has been removed', () => {
    const quizId = requestQuizCreateV2(token1, 'Quizzy', 'Game for 1511').body.quizId;
    requestQuizRemove(token1, quizId);
    const ret = requestQuizCreateV2(token1, 'Quizzy', 'Game for 1511');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body.quizId).toStrictEqual(2);
  });
});
