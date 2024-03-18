import { requestClear, requestRegister, requestLogin } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const ERROR_STRING = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
  requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam');
});

describe('Error code 400', () => {
  test('Email is not correct', () => {
    const log = requestLogin('lina123@gmail.com', 'COMP1511');

    expect(log.status).toStrictEqual(INPUT_ERROR);
    expect(log.body).toStrictEqual(ERROR_STRING);
  });
  test('Password is not correct', () => {
    const log = requestLogin('lina@gmail.com', 'COMP1521');

    expect(log.status).toStrictEqual(INPUT_ERROR);
    expect(log.body).toStrictEqual(ERROR_STRING);
  });
  test('Email/Password does not match', () => {
    requestRegister('bill@gmail.com', 'COMP1521', 'bill', 'trinh');

    const log1 = requestLogin('bill@gmail.com', 'COMP1511');
    const log2 = requestLogin('lina@gmail.com', 'COMP1521');

    expect(log1.status).toStrictEqual(INPUT_ERROR);
    expect(log1.body).toStrictEqual(ERROR_STRING);
    expect(log2.status).toStrictEqual(INPUT_ERROR);
    expect(log2.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('Basic single user log in', () => {
    const log1 = requestLogin('lina@gmail.com', 'COMP1511');

    expect(log1.status).toStrictEqual(OK);
    expect(log1.body.token).toStrictEqual(expect.any(String));
  });
  test('Having multiple users log in at the same time', () => {
    requestRegister('bill@gmail.com', 'COMP1521', 'bill', 'billone');

    const log1 = requestLogin('lina@gmail.com', 'COMP1511');
    const log2 = requestLogin('bill@gmail.com', 'COMP1521');

    expect(log1.status).toStrictEqual(OK);
    expect(log1.body.token).toStrictEqual(expect.any(String));
    expect(log2.status).toStrictEqual(OK);
    expect(log2.body.token).toStrictEqual(expect.any(String));
  });
});
