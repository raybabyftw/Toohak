// import request, { HttpVerb } from 'sync-request';
// import config from './../config.json';
import { requestClear, requestRegister, requestDetails } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const ERROR_STRING = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
});

describe('Error code 400', () => {
  test('Email is already in use', () => {
    requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam');
    const reg1 = requestRegister('lina@gmail.com', 'COMP1521', 'Lina123', 'Lam123');
    expect(reg1.status).toBe(INPUT_ERROR);
    expect(reg1.body).toStrictEqual(ERROR_STRING);
  });
  test('Email is not valid format', () => {
    const reg = requestRegister('lina', 'COMP1511', 'Lina', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst contains invalid characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'L!na', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst is less than 2 characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'L', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst is longer than 20 characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'L'.repeat(21), 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast contains invalid characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'L@m');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast is less than 2 characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'L');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast is longer than 20 characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'L'.repeat(21));
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('Password is less than 8 characters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP151', 'Lina', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('Password only contains letters', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP', 'Lina', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
  test('Password only contains numbers', () => {
    const reg = requestRegister('lina@gmail.com', '1511', 'Lina', 'Lam');
    expect(reg.status).toBe(INPUT_ERROR);
    expect(reg.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('Basic single user registration', () => {
    const reg = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam');
    expect(reg.status).toStrictEqual(OK);
    expect(reg.body).toStrictEqual({ token: expect.any(String) });
  });
});
test('Basic multiple user registration', () => {
  const reg = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam');
  expect(reg.status).toStrictEqual(OK);
  expect(reg.body.token).toStrictEqual(expect.any(String));
  const reg2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Rayhan', 'Rahman');
  const token2 = reg2.body.token;
  expect(reg2.status).toStrictEqual(OK);
  expect(token2).toStrictEqual(expect.any(String));
  expect(requestDetails(token2).body).toStrictEqual({
    user: {
      userId: 2,
      name: 'Rayhan Rahman',
      email: 'rayhan@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
});
