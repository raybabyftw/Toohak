import { requestClear, requestRegister, requestLogin, requestUpdatePasswordV2, requestLogout } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const HTTP_INVALIDLOGGEDIN = 403;
const ERROR_STRING = { error: expect.any(String) };

let token: any;

beforeEach(() => {
  requestClear();
  requestRegister('bill@gmail.com', 'COMP1511', 'Bill', 'Trinh');
  token = requestLogin('bill@gmail.com', 'COMP1511').body.token;
});

describe('Error code 400', () => {
  test('Old password does not match', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1501', 'COMP1521');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('New Password has already been used before by this user', () => {
    requestUpdatePasswordV2(token, 'COMP1511', 'COMP1521');
    requestUpdatePasswordV2(token, 'COMP1521', 'COMP1531');
    const update = requestUpdatePasswordV2(token, 'COMP1531', 'COMP1511');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('New Password is less than 8 characters', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1511', 'COMP15');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('New Password only contains numbers', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1511', '1111111123');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('New Password only contains letters', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1511', 'aaaaBBBBCDadw');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('New Password and old password are identical', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1511', 'COMP1511');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('blank space', () => {
    const update = requestUpdatePasswordV2('', 'COMP1511', 'COMP1521');

    expect(update.status).toStrictEqual(HTTP_INVALIDLOGGEDIN);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('random characters', () => {
    const update = requestUpdatePasswordV2('not even THANOS CAN SNAP THis string of letters into dust', 'COMP1511', 'COMP1521');

    expect(update.status).toStrictEqual(HTTP_INVALIDLOGGEDIN);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('updated a single user', () => {
    const update = requestUpdatePasswordV2(token, 'COMP1511', 'COMP1521');

    expect(update.status).toStrictEqual(OK);
    expect(update.body).toStrictEqual({});
  });
  test('updated multiple users', () => {
    requestRegister('billnguyen@gmail.com', 'COMP1521', 'Billy', 'Nguyen');

    const token2 = requestLogin('billnguyen@gmail.com', 'COMP1521').body.token;

    const update1 = requestUpdatePasswordV2(token, 'COMP1511', 'COMP1521');
    const update2 = requestUpdatePasswordV2(token2, 'COMP1521', 'COMP2411');
    requestLogout(token2);
    const ret = requestLogin('billnguyen@gmail.com', 'COMP2411');

    expect(update1.status).toStrictEqual(OK);
    expect(update1.body).toStrictEqual({});
    expect(update2.status).toStrictEqual(OK);
    expect(update2.body).toStrictEqual({});
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({ token: expect.any(String) });
  });
});
